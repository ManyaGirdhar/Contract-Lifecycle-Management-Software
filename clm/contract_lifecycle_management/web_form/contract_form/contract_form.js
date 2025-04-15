// frappe.ready(function() {
//     // Wait for the form to render fully
//     setTimeout(function() {
//         if (window.frappe.web_form) {
//             // Example: Add an Approve button
//             $('<button class="btn btn-primary" style="margin: 10px;">Approve</button>')
//                 .appendTo('.web-form-footer')
//                 .click(function() {
//                     // Your workflow logic or server call here
//                     frappe.call({
//                         method: 'frappe.client.set_value',
//                         args: {
//                             doctype: 'Contract',
//                             name: frappe.web_form.doc.name,
//                             fieldname: 'status',
//                             value: 'Approved'
//                         },
//                         callback: function(response) {
//                             frappe.msgprint('Contract Approved!');
//                             location.reload();
//                         }
//                     });
//                 });

//             // Example: Add a Reject button
//             $('<button class="btn btn-danger" style="margin: 10px;">Reject</button>')
//                 .appendTo('.web-form-footer')
//                 .click(function() {
//                     frappe.call({
//                         method: 'frappe.client.set_value',
//                         args: {
//                             doctype: 'Contract',
//                             name: frappe.web_form.doc.name,
//                             fieldname: 'status',
//                             value: 'Rejected'
//                         },
//                         callback: function(response) {
//                             frappe.msgprint('Contract Rejected!');
//                             location.reload();
//                         }
//                     });
//                 });
//         }
//     }, 500);
// });


frappe.ready(function () {
    setTimeout(function () {
        let docname = null;

        // Detect if opened as web form or directly
        if (window.frappe.web_form && frappe.web_form.doc) {
            docname = frappe.web_form.doc.name;
        } else {
            // Get name from URL if not web_form
            const urlParts = window.location.pathname.split('/');
            docname = urlParts[urlParts.length - 1];
        }

        if (docname) {
            frappe.call({
                method: 'frappe.client.get',
                args: {
                    doctype: 'Contract',
                    name: docname
                },
                callback: function (response) {
                    if (response.message) {
                        let current_state = response.message.workflow_state;
                        show_workflow_status_on_top(current_state);
                        add_action_dropdown_on_top(current_state, docname);
                    }
                }
            });
        }
    }, 1000);
});

function show_workflow_status_on_top(current_state) {
    const workflow_html = `
        <div id="workflow-status-banner" style="background-color: #f0f4ff; padding: 10px; border-radius: 8px; margin-bottom: 20px;">
            <h4>Your Contract's state: <span style="color: #3b82f6;">${current_state}</span></h4>
        </div>
    `;
    $('.web-form-header, .page-head, .layout-main-section').first().prepend(workflow_html);
}

function add_action_dropdown_on_top(current_state, docname) {
    const transitions = {
        "Draft": [{ action: "Approve", next_state: "Approved" }],
        "Approved": [
            { action: "Send for Negotiation", next_state: "In negotiation" },
            { action: "Reject", next_state: "Rejected" }
        ],
        "In negotiation": [
            { action: "Send to Legal", next_state: "Legal Review" },
            { action: "Reject", next_state: "Rejected" }
        ],
        "Legal Review": [
            { action: "Modify", next_state: "Modified" },
            { action: "Final Approval", next_state: "Final Approval" },
            { action: "Reject", next_state: "Rejected" }
        ],
        "Modified": [{ action: "Send Back to Negotiation", next_state: "In negotiation" }],
        "Final Approval": [
            { action: "Mark as Negotiated", next_state: "Negotiated" },
            { action: "Reject", next_state: "Rejected" }
        ],
        "Negotiated": [
            { action: "Send for Signature", next_state: "Awaiting Signature" },
            { action: "Reject", next_state: "Rejected" }
        ],
        "Awaiting Signature": [{ action: "Mark as Signed", next_state: "Active" }]
    };

    const actions = transitions[current_state] || [];

    if (actions.length > 0) {
        const actionHtml = `
            <div id="action-bar" style="margin-bottom: 20px; display: flex; gap: 10px; align-items: center;">
                <label style="margin: 0;"><b>Take Action:</b></label>
                <select id="workflow_action_selector" class="form-control" style="width: 250px;">
                    <option value="">-- Select Action --</option>
                    ${actions.map(({ action, next_state }) => `
                        <option value="${action}|${next_state}">${action}</option>
                    `).join('')}
                </select>
                <button id="submit_action_btn" class="btn btn-primary">Submit</button>
            </div>
        `;

        $('.web-form-header, .page-head, .layout-main-section').first().prepend(actionHtml);

        $('#submit_action_btn').click(function () {
            const selectedValue = $('#workflow_action_selector').val();
            if (!selectedValue) {
                frappe.msgprint('Please select an action.');
                return;
            }
            const [action, next_state] = selectedValue.split('|');

            frappe.confirm(
                `Are you sure you want to <b>${action}</b> this contract?`,
                function () {
                    frappe.call({
                        method: 'frappe.client.set_value',
                        args: {
                            doctype: 'Contract',
                            name: docname,
                            fieldname: 'workflow_state',
                            value: next_state
                        },
                        callback: function () {
                            frappe.msgprint(`Contract has been <b>${action}d</b>. New state: <b>${next_state}</b>`);
                            location.reload();
                        }
                    });
                },
                function () {
                    frappe.msgprint('Action cancelled.');
                }
            );
        });
    }
}
