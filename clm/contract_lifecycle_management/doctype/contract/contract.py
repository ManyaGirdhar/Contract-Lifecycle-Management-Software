# Copyright (c) 2025, Manya and contributors
# For license information, please see license.txt

import re
import frappe
import difflib
from bs4 import BeautifulSoup
from frappe.utils import add_months
from frappe.website.website_generator import WebsiteGenerator


class Contract(WebsiteGenerator):

	def before_save(doc):
		if doc.contract_effective_date and doc.contract_duration:
			doc.contract_end_date = add_months(doc.contract_effective_date, doc.contract_duration)

		if doc.amount_to_receive and doc.tax is not None:
			tax_amount = (doc.amount_to_receive * doc.tax) / 100
			doc.total_amount = doc.amount_to_receive + tax_amount
		else:
			doc.total_amount = doc.amount_to_receive or 0

	def after_insert(doc):
		doc.create_initial_version()

	def create_initial_version(doc):
		version = frappe.new_doc("Contract Version")
		version.contract = doc.name
		version.version_no = "0"
		version.effective_date = doc.contract_effective_date
		version.change_log = "Initial Version"
		version.status = doc.workflow_state if hasattr(doc, "workflow_state") else "Draft"
		version.created_by = frappe.session.user
		version.created_on = frappe.utils.now_datetime()
		version.redlined_contract = "No redlining"
		version.insert(ignore_permissions=True)

	def on_update(doc):
		previous_versions = frappe.get_all(
			"Contract Version",
			filters={"contract": doc.name},
			fields=["name", "version_no", "current_version"],
			order_by="CAST(version_no AS UNSIGNED) DESC", 
			limit=1
		)

		latest_version = previous_versions[0] if previous_versions else None
		new_version_no = str(int(latest_version.version_no) + 1) if latest_version else "1"
		
		# Get previous doc state before save
		previous_doc = doc.get_doc_before_save()

		# Identify changed fields
		changed_fields = []
		if previous_doc:
			for field in doc.meta.fields:
				fieldname = field.fieldname
				if not fieldname:
					continue
				old = previous_doc.get(fieldname)
				new = doc.get(fieldname)
				if old != new:
					changed_fields.append(field.label or fieldname)

		change_log = (
			"Updated to version " + new_version_no +
			(f" | Fields changed: {', '.join(changed_fields)}" if changed_fields else "")
		)


		new_version = frappe.new_doc("Contract Version")
		new_version.contract = doc.name
		new_version.version_no = new_version_no
		new_version.effective_date = doc.contract_effective_date
		new_version.status = doc.workflow_state if hasattr(doc, "workflow_state") else "Updated"
		new_version.created_by = frappe.session.user
		new_version.created_on = frappe.utils.now_datetime()
		new_version.change_log = change_log
		new_version.previous_version = latest_version.current_version if latest_version else "N/A"
		new_version.current_version = doc.get_formatted("content") or "Updated content"

		# Generate redlined contract content
		previous_content = latest_version.current_version if latest_version else ""
		current_content = doc.get_formatted("content") or "Updated content"

		# Call the redline diff function directly
		redlined_html = get_redlined_diff(previous_content, current_content)

		# Store the redlined result in the version doc
		new_version.redlined_contract = f"<div style='line-height: 1.8;'>{redlined_html}</div>"


		frappe.db.set_value("Contract", doc.name, "current_version", doc.name + "-" + new_version_no)
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

    # Join result with smart spacing
    final_html = ''
    for i, token in enumerate(result):
        if i > 0 and not re.match(r'[.,!?;:]', token) and not token.startswith('<'):
            final_html += ' '
        final_html += token

    return f"""
    <div style="font-family:monospace;font-size:14px;line-height:1.5;white-space:pre-wrap;">
        {final_html}
    </div>
    """
