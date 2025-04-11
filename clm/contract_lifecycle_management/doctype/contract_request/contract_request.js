// Copyright (c) 2025, Manya and contributors
// For license information, please see license.txt



frappe.ui.form.on('Contract Request', {
    refresh(frm) {
        // ✅ Replace Submit button label with "Approve"
        if (!frm.doc.__islocal && frm.doc.docstatus === 0) {
            frm.page.set_primary_action(__('Approve'), () => {
                frappe.confirm(
                    'Are you sure you want to approve this Contract Request?',
                    () => {
                        frm.save('Submit');  // Triggers standard submit behavior
                    },
                    () => {
                        frappe.msgprint('Approval cancelled.');
                    }
                );
            });
        }

        // ✅ Show "Create Contract" only when request is submitted
        if (frm.doc.docstatus === 1) {
        // ✅ Add "Create Contract" button
            frm.add_custom_button(__('Create Contract'), function () {
                frappe.model.open_mapped_doc({
                    method: "clm.contract_lifecycle_management.doctype.contract_request.contract_request.create_contract_from_request",
                    frm: frm
                });
            });
        }
    }
});







