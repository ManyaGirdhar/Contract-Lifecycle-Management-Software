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