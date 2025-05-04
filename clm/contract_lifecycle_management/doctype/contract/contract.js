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
                    },
                    error: function(err) {
                        frappe.msgprint(__('Failed to connect to server.'));
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
                    // Set filters for version1 and version2 fields
                d.fields_dict.version1.get_query = function() {
                    return {
                        filters: {
                            contract: frm.doc.name
                        }
                    };
                };
                d.fields_dict.version2.get_query = function() {
                    return {
                        filters: {
                            contract: frm.doc.name
                        }
                    };
                };

                d.show(); 
            });
        }

        // Download Contract Button
        if (["Active", "Expired"].includes(frm.doc.workflow_state) && frm.doc.download_url) {
            frm.add_custom_button('Download Contract', () => {
                window.open(frm.doc.download_url, '_blank');
            });
        }
        
        // Summarize Contract Button
        if (frm.doc.content){
            frm.add_custom_button('Summarize Contract', () => {
                if (!frm.doc.content) {
                    frappe.msgprint('Contract content is empty. Nothing to summarize.');
                    return;
                }
        
                frappe.call({
                    method: "clm.contract_lifecycle_management.doctype.contract.contract.summarize_contract_text",
                    args: {
                        name: frm.doc.name  // <-- Make sure this is included!
                    },
                    callback: function(r) {
                        if (r.message) {
                            frappe.msgprint({
                                title: __('Contract Summary'),
                                indicator: 'green',
                                message: `<div style="max-height: 300px; overflow-y: auto;">${r.message}</div>`
                            });
                        } else {
                            frappe.msgprint(__('No summary returned.'));
                        }
                    },
                    error: function(err) {
                        frappe.msgprint(__('Failed to summarize the contract.'));
                        console.error("Summarizer Error:", err);
                    }
                });
            });
        }
            
        // Fetch Template Content Button
        if (frm.doc.workflow_state === 'Draft') {
        frm.add_custom_button('Fetch Template Content', () => {
            if (!frm.doc.contract_type) {
                frappe.msgprint('Please select a Contract Type first.');
                return;
            }

            frappe.call({
                method: "clm.contract_lifecycle_management.doctype.contract.contract.get_contract_template", 
                args: {
                    contract_type: frm.doc.contract_type
                },
                callback: function(r) {
                    if (r.message) {
                        frm.set_value('content', r.message); // assuming content field exists
                        frappe.msgprint('Content fetched from template!');
                    } else {
                        frappe.msgprint('No template found for this contract type.');
                    }
                }
            });
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


frappe.realtime.on('workflow_state_updated', (data) => {
    window.location.reload()
    console.log(data)
   })
   