import frappe

def get_context(context):
    name = frappe.form_dict.get("name")  # Get the contract name from the URL

    if name:
        contract = frappe.get_doc("Contract", name)  # Fetch contract
        context.contract_title = contract.contract_title
        context.content = contract.content
        context.name = name  # Ensure the name is passed back
    elif "/contract/new" not in frappe.local.request.url:
        # Redirect only if the user is NOT already on the new contract page
        frappe.local.flags.redirect_location = "/contract/new"
        raise frappe.Redirect