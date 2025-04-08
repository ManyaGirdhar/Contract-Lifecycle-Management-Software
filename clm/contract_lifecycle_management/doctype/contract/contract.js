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

    after_save: function(frm) {
        console.log("after_save triggered!");
        frm.reload_doc();  // Refreshes the form without full page reload
    },

    refresh: function(frm) {
        frm.page.wrapper.off("click", ".user-action a").on("click", ".user-action a", function(event) {
            let label = $(this).find(".menu-item-label").text().trim();

            if (label === "Send for Signature") {
                event.preventDefault();

                let contract_name = frm.doc.name;

                frappe.call({
                    method: "documenso_integration.api.sign_contract",
                    args: { contract_name: contract_name },
                    callback: function(response) {
                        console.log("API Response:", response); // Debugging statement

                        // if (response) {
                        //     frappe.msgprint(__('Document sent for signature successfully!'));
                        //     frappe.set_route("Form", "Contract", contract_name);
                        // } else {
                        //     // frappe.msgprint(__('Error sending document for signature.'));
                        //     console.error("Error response:", response);
                        // }
                    },
                    error: function(err) {
                        frappe.msgprint(__('Failed to connect to server.'));
                        // console.error("AJAX Error:", err);
                    }
                });
            }
        });

        // Show Redline Comparison Dropdown Dialog
        if (frm.doc.current_version && frm.doc.__unsaved !== 1) {
            frm.add_custom_button("Compare Versions", () => {
                const d = new frappe.ui.Dialog({
                    title: 'Compare Contract Versions',
                    fields: [
                        {
                            label: 'Version 1',
                            fieldname: 'version1',
                            fieldtype: 'Link',
                            options: 'Contract Version',
                            reqd: 1
                        },
                        {
                            label: 'Version 2',
                            fieldname: 'version2',
                            fieldtype: 'Link',
                            options: 'Contract Version',
                            reqd: 1
                        }
                    ],
                    primary_action_label: 'Compare',
                    primary_action(values) {
                        if (values.version1 && values.version2) {
                            // Fetch Version 1 content
                            frappe.call({
                                method: "frappe.client.get_value",
                                args: {
                                    doctype: "Contract Version",
                                    filters: { name: values.version1 },
                                    fieldname: "current_version"
                                },
                                callback: function (res1) {
                                    // Fetch Version 2 content
                                    frappe.call({
                                        method: "frappe.client.get_value",
                                        args: {
                                            doctype: "Contract Version",
                                            filters: { name: values.version2 },
                                            fieldname: "current_version"
                                        },
                                        callback: function (res2) {
                                            // Now compare the fetched versions
                                            frappe.call({
                                                method: "clm.contract_lifecycle_management.doctype.contract.contract.get_redlined_diff",
                                                args: {
                                                    prev_text: res1.message.current_version || "",
                                                    curr_text: res2.message.current_version || ""
                                                },
                                                callback: function(r) {
                                                    if (r.message) {
                                                        frappe.msgprint({
                                                            title: __('Redlined Comparison'),
                                                            indicator: 'blue',
                                                            message: `<div style="max-height: 400px; overflow-y: auto;">${r.message}</div>`
                                                        });
                                                    }
                                                }
                                            });
                                        }
                                    });
                                }
                            });

                            d.hide(); 
                        } else {
                            frappe.msgprint(__('Please select both versions to compare.'));
                        }
                    }
                });

                d.show(); 
            });
        }
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
