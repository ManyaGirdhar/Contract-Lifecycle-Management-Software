import frappe

@frappe.whitelist()
def fetch_contracts(user_email, user_roles):
    import json

    # Parse roles if they come as a JSON string from frontend
    if isinstance(user_roles, str):
        user_roles = json.loads(user_roles)

    allowed_states = [
        "In Negotiation",
        "Legal Review",
        "Modified",
        "Final Approval",
        "Negotiated",
        "Awaiting Signature",
        "Active",
        "Rejected"
    ]

    results = []

    contracts = frappe.get_all("Contract", 
        filters={"workflow_state": ["in", allowed_states]},
        fields=["name", "workflow_state", "counterparty_email", "title"]
    )

    for contract in contracts:
        doc = frappe.get_doc("Contract", contract.name)

        is_counterparty = "CounterParty" in user_roles
        is_legal_team = "CounterParty Legal Team" in user_roles
        is_signee = "Signee" in user_roles

        if is_counterparty and doc.counterparty_email == user_email:
            results.append({
                "name": doc.name,
                "title": doc.title,
                "workflow_state": doc.workflow_state,
                "counterparty_email": doc.counterparty_email,
                "legal_member_email": None,
                "signee_email": None
            })

        elif is_legal_team and doc.workflow_state == "Legal Review":
            user_in_legal_team = any(member.email == user_email for member in doc.legal_team)
            if user_in_legal_team:
                results.append({
                    "name": doc.name,
                    "title": doc.title,
                    "workflow_state": doc.workflow_state,
                    "counterparty_email": doc.counterparty_email,
                    "legal_member_email": user_email,
                    "signee_email": None
                })

        elif is_signee:
            user_in_signee = any(member.email == user_email for member in doc.signee)
            if user_in_signee:
                results.append({
                    "name": doc.name,
                    "title": doc.title,
                    "workflow_state": doc.workflow_state,
                    "counterparty_email": doc.counterparty_email,
                    "legal_member_email": None,
                    "signee_email": user_email
                })
    print(results)

    return results