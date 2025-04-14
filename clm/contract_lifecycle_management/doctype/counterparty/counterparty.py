# Copyright (c) 2025, Manya and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class CounterParty(Document):
    def after_insert(self):
        self.create_user_with_role()

    def create_user_with_role(self):
        # Create user for Legal Team Member
        if self.member_email and not frappe.db.exists("User", self.member_email):
            user = frappe.get_doc({
                "doctype": "User",
                "email": self.member_email,
                "first_name": self.member_name,
                "roles": [{"role": "CounterParty Legal Team"}],
                "user_type": "Website User"
            })
            user.insert(ignore_permissions=True)

        # Create or update user for Negotiator
        if self.requester_email:
            if not frappe.db.exists("User", self.requester_email):
                user = frappe.get_doc({
                    "doctype": "User",
                    "email": self.requester_email,
                    "first_name": self.organization,
                    "phone": self.requester_phone_no or "",
                    "roles": [{"role": "Counterparty"}],
                    "user_type": "Website User"
                })
                user.insert(ignore_permissions=True)
            else:
                user = frappe.get_doc("User", self.requester_email)
                if not any(r.role == "Counterparty" for r in user.roles):
                    user.append("roles", {"role": "Counterparty"})
                    user.save(ignore_permissions=True)
