# Copyright (c) 2025, Manya and Contributors
# See license.txt

import frappe
from frappe.tests.utils import FrappeTestCase
from frappe.utils import add_months, nowdate

class TestContract(FrappeTestCase):
	def setUp(self):
		# Create a test counterparty if it doesn't exist
		if not frappe.db.exists("CounterParty", "Test Acme Corp"):
			self.counterparty = frappe.get_doc({
				"doctype": "CounterParty",
				"organization": "Test Acme Corp",
				"requester_email": "test_acme@example.com",
				"requester_phone_no": "+919999999999",
				"address": "Test Address",
				"organization_website": "https://testacme.com"
			})
			self.counterparty.insert(ignore_permissions=True)
		else:
			self.counterparty = frappe.get_doc("CounterParty", "Test Acme Corp")

	def tearDown(self):
		# Cleanup documents created in tests
		frappe.db.delete("Contract", {"counterparty_name": "Test Acme Corp"})
		frappe.db.delete("CounterParty", {"organization": "Test Acme Corp"})

	def test_contract_date_calculation(self):
		contract = frappe.get_doc({
			"doctype": "Contract",
			"title": "Test NDA 2026",
			"contract_type": "Confidentiality & Non-Disclosure Contract",
			"counterparty_name": "Test Acme Corp",
			"counterparty_email": "test_acme@example.com",
			"contract_term": "Definite",
			"contract_duration": 12,
			"contract_effective_date": "2026-06-26",
			"content": "<p>Test Content</p>",
			"amount_to_receive": 1000,
			"tax": 18,
			"requester_name": "Test Requester",
			"requester_department": "Legal"
		})
		contract.insert(ignore_permissions=True)

		# Check if end date is calculated correctly (12 months from 2026-06-26)
		self.assertEqual(str(contract.contract_end_date), "2027-06-26")

		# Check if total amount is calculated correctly (1000 + 18% tax = 1180)
		self.assertEqual(contract.total_amount, 1180)
