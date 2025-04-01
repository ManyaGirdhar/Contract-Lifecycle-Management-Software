// Copyright (c) 2025, Manya and contributors
// For license information, please see license.txt

frappe.ui.form.on('Contract', {
    contract_effective_date: function(frm) {
        calculate_end_date(frm);
    },

    contract_duration: function(frm) {
        calculate_end_date(frm);
    },

    amount_to_receive: function(frm) {
        calculate_total(frm);
    },

    tax: function(frm) {
        calculate_total(frm);
    },

    refresh: function(frm) {
        console.log("Refresh event triggered for Contract form"); // Debugging

        // Unbind previous events to avoid duplicate bindings
        frm.page.wrapper.off("click", ".user-action a").on("click", ".user-action a", function(event) {
            let label = $(this).find(".menu-item-label").text().trim();
            console.log("Dropdown item clicked, label:", label); // Debugging

            if (label === "Send for Signature") {
                event.preventDefault();
                console.log("Send for Signature button detected, proceeding..."); // Debugging

                let contract_name = frm.doc.name;
                console.log("Contract Name:", contract_name); // Debugging statement

                frappe.call({
                    method: "documenso_integration.api.sign_contract",
                    args: { contract_name: contract_name },
                    callback: function(response) {
                        console.log("API Response:", response); // Debugging statement

                        if (response && response.message) {
                            frappe.msgprint(__('Document sent for signature successfully!'));
                            frappe.set_route("Form", "Contract", contract_name);
                        } else {
                            frappe.msgprint(__('Error sending document for signature.'));
                            console.error("Error response:", response);
                        }
                    },
                    error: function(err) {
                        frappe.msgprint(__('Failed to connect to server.'));
                        console.error("AJAX Error:", err);
                    }
                });
            }
        });
    }
});


function calculate_end_date(frm) {
    if (frm.doc.contract_effective_date && frm.doc.contract_duration) {
        let startDate = frappe.datetime.str_to_obj(frm.doc.contract_effective_date);
        let endDate = frappe.datetime.add_months(startDate, frm.doc.contract_duration);
        frm.set_value('contract_end_date', frappe.datetime.obj_to_str(endDate));
    }
}

function calculate_total(frm) {
    let amount = frm.doc.amount_to_receive || 0;
    let tax_percentage = frm.doc.tax || 0;
    let tax_amount = (amount * tax_percentage) / 100;
    frm.set_value('total_amount', amount + tax_amount);
}
