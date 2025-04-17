# Copyright (c) 2025, Manya and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class ContractRequest(Document):
	pass
        
@frappe.whitelist()
def create_contract_from_request(source_name):
	# Get the ContractRequest document
	contract_request = frappe.get_doc("Contract Request", source_name)

	# Create a new Contract document
	contract = frappe.new_doc("Contract")

	# Map fields from ContractRequest to Contract
	contract.contract_type = contract_request.contract_type
	contract.title = contract_request.title
	contract.contract_duration = contract_request.contract_duration
	contract.requester_type = contract_request.requester_type
	contract.counterparty_name = contract_request.requester_name
	contract.counterparty_email = contract_request.requester_email
	contract.description = contract_request.description
	contract.request_id = contract_request.name  # Optional: Add reference back to request
	contract.contract_term = contract_request.contract_term
	contract.contract_effective_date = contract_request.contract_effective_date
	contract.termination_clause_summary = contract_request.termination_clause_summary


	# Return new document so open_mapped_doc can handle it
	return contract
