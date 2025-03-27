# Copyright (c) 2025, Manya and contributors
# For license information, please see license.txt

import frappe
from frappe.website.website_generator import WebsiteGenerator
from frappe.utils import add_months


class Contract(WebsiteGenerator):
	def before_save(doc):
		if doc.contract_effective_date and doc.contract_duration:
			doc.contract_end_date = add_months(doc.contract_effective_date, doc.contract_duration)

		if doc.amount_to_receive and doc.tax is not None:
			tax_amount = (doc.amount_to_receive * doc.tax) / 100
			doc.total_amount = doc.amount_to_receive + tax_amount
		else:
			doc.total_amount = doc.amount_to_receive or 0
