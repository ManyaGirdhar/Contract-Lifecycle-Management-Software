# Copyright (c) 2025, Manya and contributors
# For license information, please see license.txt

import os
import re
import frappe
import difflib
# from dotenv import load_dotenv
from bs4 import BeautifulSoup
# import google.generativeai as genai
from frappe.utils import add_months, nowdate, get_datetime_str, get_date_str
from frappe.website.website_generator import WebsiteGenerator

# Load environment variables
# load_dotenv()

class Contract(WebsiteGenerator):

	def before_save(self):
		if self.contract_effective_date and self.contract_duration:
			self.contract_end_date = add_months(self.contract_effective_date, self.contract_duration)

		if self.amount_to_receive and self.tax is not None:
			tax_amount = (self.amount_to_receive * self.tax) / 100
			self.total_amount = self.amount_to_receive + tax_amount
		else:
			self.total_amount = self.amount_to_receive or 0

	def after_insert(self):
		self.create_initial_version()
		self.create_user_with_role()

		counterparty_doc = frappe.get_doc("CounterParty", self.counterparty_name)

    	# Collect emails from both child tables
		legal_emails = [member.email for member in self.legal_team if member.email]
		signee_emails = [member.email for member in self.signee if member.email]

		# Append a single row for this contract
		counterparty_doc.append("team_members", {
			"contract_assigned": self.name,
			"email": ", ".join(legal_emails) if legal_emails else None,
			"signee_email": ", ".join(signee_emails) if signee_emails else None
		})

		counterparty_doc.save(ignore_permissions=True)

	def create_user_with_role(self):
    # Handle Legal Team Members
		for member in self.legal_team:
			if member.email:
				if frappe.db.exists("User", member.email):
					user = frappe.get_doc("User", member.email)
					existing_roles = [r.role for r in user.roles]
					if "CounterParty Legal Team" not in existing_roles:
						user.append("roles", {"role": "CounterParty Legal Team"})
						user.save(ignore_permissions=True)
				else:
					user = frappe.get_doc({
						"doctype": "User",
						"email": member.email,
						"first_name": member.first_name,
						"last_name": member.last_name,
						"roles": [{"role": "CounterParty Legal Team"}],
						"user_type": "Website User"
					})
					user.insert(ignore_permissions=True)

		# Handle Signees
		for mem in self.signee:
			if mem.email:
				if frappe.db.exists("User", mem.email):
					user = frappe.get_doc("User", mem.email)
					existing_roles = [r.role for r in user.roles]
					if "Signee" not in existing_roles:
						user.append("roles", {"role": "Signee"})
						user.save(ignore_permissions=True)
				else:
					user = frappe.get_doc({
						"doctype": "User",
						"email": mem.email,
						"first_name": mem.first_name,
						"last_name": mem.last_name,
						"roles": [{"role": "Signee"}],
						"user_type": "Website User"
					})
					user.insert(ignore_permissions=True)


	# @staticmethod
	def create_initial_version(self):
		version = frappe.new_doc("Contract Version")
		version.contract = self.name
		version.version_no = "0"
		version.effective_date = self.contract_effective_date
		version.change_log = "Initial Version"
		version.current_version = self.content
		version.status = self.workflow_state if hasattr(self, "workflow_state") else "Draft"
		version.created_by = frappe.session.user
		version.created_on = frappe.utils.now_datetime()
		version.redlined_contract = "No redlining"
		
		version.insert(ignore_permissions=True)

		frappe.db.set_value("Contract", self.name, "current_version", version.name)

	def on_update(self):
		if frappe.flags.in_insert:
			return
		
		previous_doc = self.get_doc_before_save()
		
		if not previous_doc:
			return  # No previous version to compare 
			
		previous_versions = frappe.get_all(
			"Contract Version",
			filters={"contract": self.name},
			fields=["name", "version_no", "current_version"],
			order_by="CAST(version_no AS UNSIGNED) DESC", 
			limit=1
		)

		latest_version = previous_versions[0] if previous_versions else None
		new_version_no = str(int(latest_version.version_no) + 1) if latest_version else "1"

		changed_fields = []
		if previous_doc:
			for field in self.meta.fields:
				fieldname = field.fieldname
				if not fieldname:
					continue
				old = previous_doc.get(fieldname)
				new = self.get(fieldname)

				# Normalize date fields
				if field.fieldtype in ["Date", "Datetime"]:
					if old:
						old = get_date_str(old) if field.fieldtype == "Date" else get_datetime_str(old)
					if new:
						new = get_date_str(new) if field.fieldtype == "Date" else get_datetime_str(new)

				if old != new:
					changed_fields.append(field.label or fieldname)
		change_log = (
			"Updated to version " + new_version_no +
			(f" | Fields changed: {', '.join(changed_fields)}" if changed_fields else "")
		)


		new_version = frappe.new_doc("Contract Version")
		new_version.contract = self.name
		new_version.version_no = new_version_no
		new_version.effective_date = self.contract_effective_date
		new_version.status = self.workflow_state if hasattr(self, "workflow_state") else "Updated"
		new_version.created_by = frappe.session.user
		new_version.created_on = frappe.utils.now_datetime()
		new_version.change_log = change_log
		new_version.previous_version = latest_version.current_version if latest_version else "N/A"
		new_version.current_version = self.get_formatted("content") or "Updated content"

		# Generate redlined contract content
		previous_content = latest_version.current_version if latest_version else ""
		current_content = self.get_formatted("content") or "Updated content"

		# Call the redline diff function directly
		redlined_html = get_redlined_diff(previous_content, current_content)

		# Store the redlined result in the version doc
		new_version.redlined_contract = f"<div style='line-height: 1.8;'>{redlined_html}</div>"


		frappe.db.set_value("Contract", self.name, "current_version", self.name + "-" + new_version_no)
		new_version.insert(ignore_permissions=True)



@frappe.whitelist()
def get_redlined_diff(prev_text, curr_text):
	"""Return a redlined inline diff with removed text in red and added text in green."""
	def extract_text(html):
		return BeautifulSoup(html, "html.parser").get_text()

	def tokenize(text):
		# Tokenizes words and punctuation separately
		return re.findall(r'\w+|[^\w\s]', text, re.UNICODE)

	prev_clean = extract_text(prev_text)
	curr_clean = extract_text(curr_text)

	prev_tokens = tokenize(prev_clean)
	curr_tokens = tokenize(curr_clean)

	matcher = difflib.SequenceMatcher(None, prev_tokens, curr_tokens)
	result = []

	for tag, i1, i2, j1, j2 in matcher.get_opcodes():
		if tag == 'equal':
			result.extend(curr_tokens[j1:j2])
		elif tag == 'insert':
			result.extend([f'<span style="color:green;">{t}</span>' for t in curr_tokens[j1:j2]])
		elif tag == 'delete':
			result.extend([f'<span style="color:red;text-decoration:line-through;">{t}</span>' for t in prev_tokens[i1:i2]])
		elif tag == 'replace':
			for old, new in zip(prev_tokens[i1:i2], curr_tokens[j1:j2]):
				if old == new:
					result.append(old)
				else:
					result.append(f'<span style="color:red;text-decoration:line-through;">{old}</span>')
					result.append(f'<span style="color:green;">{new}</span>')
			# Handle token count mismatch
			if len(prev_tokens[i1:i2]) > len(curr_tokens[j1:j2]):
				result.extend([f'<span style="color:red;text-decoration:line-through;">{t}</span>' for t in prev_tokens[i1 + len(curr_tokens[j1:j2]):i2]])
			elif len(curr_tokens[j1:j2]) > len(prev_tokens[i1:i2]):
				result.extend([f'<span style="color:green;">{t}</span>' for t in curr_tokens[j1 + len(prev_tokens[i1:i2]):j2]])

	final_html = ''
	for i, token in enumerate(result):
		if i > 0 and not re.match(r'[.,!?;:]', token) and not token.startswith('<'):
			final_html += ' '
		final_html += token

	return f"""
	<div style="font-family:monospace;font-size:14px;line-height:1.5;">
		{final_html}
	</div>
	"""

def update_expired_contracts():
	today = nowdate()
	
	# Fetch contracts where end_date < today and current workflow state is not 'Expired'
	contracts = frappe.get_all("Contract", 
		filters={
			"contract_end_date": ["<", today],
			"workflow_state": ["!=", "Expired"]
		},
		fields=["name", "workflow_state"]
	)

	for contract in contracts:
		try:
			doc = frappe.get_doc("Contract", contract.name)
			doc.workflow_state = "Expired"  # Make sure this is a valid state in your workflow
			doc.save()
		except Exception as e:
			frappe.log_error(f"Failed to update workflow for Contract {contract.name}: {str(e)}")

	frappe.db.commit()

@frappe.whitelist()
def get_contract_template(contract_type):
	template = frappe.db.get_value('Contract Content', {'contract_type': contract_type}, 'content')
	
	# If using a Long Text field (in case of legacy data)
	# Ensure it's not escaping HTML tags in case of legacy Long Text field
	if template:
		template = frappe.utils.cstr(template)
	return template

@frappe.whitelist()
def compare_versions(version1, version2):
	contract_name = frappe.db.get_value("Contract Version", version1, "contract")
	if contract_name:
		frappe.has_permission("Contract", "read", doc=contract_name, throw=True)
	
	v1_content = frappe.db.get_value("Contract Version", version1, "current_version") or ""
	v2_content = frappe.db.get_value("Contract Version", version2, "current_version") or ""
	return get_redlined_diff(v1_content, v2_content)

@frappe.whitelist()
def summarize_contract_text(name):
	try:
		import google.generativeai as genai
		api_key = frappe.db.get_single_value("Gemini Settings", "api_key")
		if not api_key:
			return _("Gemini API key is not configured in Gemini Settings.")

		genai.configure(api_key=api_key)
		doc = frappe.get_doc("Contract", name)
		
		# Validate user permission to read the contract
		frappe.has_permission("Contract", "read", doc=doc, throw=True)

		model = genai.GenerativeModel("gemini-1.5-pro-latest")
		prompt = f"""
				You are a contract summarization assistant. Provide a professional and concise summary of the following contract:

				Contract Name: {doc.name}
				Contract Type: {doc.contract_type}
				Effective Date: {doc.contract_effective_date}
				End Date: {doc.contract_end_date}
				Duration: {doc.contract_duration} month(s)
				Workflow State: {doc.workflow_state}
				Amount to Receive: {doc.amount_to_receive}
				Tax: {doc.tax}%
				Total Amount: {doc.total_amount}

				Contract Content:
				{doc.content}

				Focus on explaining the purpose of the contract, key dates, financial details, and any important clauses found in the content.
				"""
		response = model.generate_content(prompt)

		return response.text if hasattr(response, "text") else _("Summary not available.")

	except Exception as e:
		frappe.log_error(frappe.get_traceback(), "Contract Summarization Error")
		return f"Error occurred: {str(e)}"