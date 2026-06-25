import frappe

@frappe.whitelist()
def fetch_contracts():
    user_email = frappe.session.user
    user_roles = frappe.get_roles(user_email)

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

    if not contracts:
        return []

    contract_names = [c.name for c in contracts]

    # Bulk fetch legal team members
    legal_team_members = frappe.get_all("Legal Team",
        filters={"parent": ["in", contract_names], "parenttype": "Contract"},
        fields=["parent", "email"]
    )
    legal_team_map = {}
    for member in legal_team_members:
        if member.email:
            legal_team_map.setdefault(member.parent, []).append(member.email)

    # Bulk fetch signees
    signees = frappe.get_all("Signee",
        filters={"parent": ["in", contract_names], "parenttype": "Contract"},
        fields=["parent", "email"]
    )
    signee_map = {}
    for signee in signees:
        if signee.email:
            signee_map.setdefault(signee.parent, []).append(signee.email)

    for contract in contracts:
        is_counterparty = "CounterParty" in user_roles
        is_legal_team = "CounterParty Legal Team" in user_roles
        is_signee = "Signee" in user_roles

        if is_counterparty and contract.counterparty_email == user_email:
            results.append({
                "name": contract.name,
                "title": contract.title,
                "workflow_state": contract.workflow_state,
                "counterparty_email": contract.counterparty_email,
                "legal_member_email": None,
                "signee_email": None
            })

        elif is_legal_team and contract.workflow_state == "Legal Review":
            legal_emails = legal_team_map.get(contract.name, [])
            if user_email in legal_emails:
                results.append({
                    "name": contract.name,
                    "title": contract.title,
                    "workflow_state": contract.workflow_state,
                    "counterparty_email": contract.counterparty_email,
                    "legal_member_email": user_email,
                    "signee_email": None
                })

        elif is_signee:
            signee_emails = signee_map.get(contract.name, [])
            if user_email in signee_emails:
                results.append({
                    "name": contract.name,
                    "title": contract.title,
                    "workflow_state": contract.workflow_state,
                    "counterparty_email": contract.counterparty_email,
                    "legal_member_email": None,
                    "signee_email": user_email
                })

    return results