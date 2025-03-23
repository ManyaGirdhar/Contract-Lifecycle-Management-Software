frappe.ready(function() {
    let params = new URLSearchParams(window.location.search);
    let contract_name = params.get('contract_name'); // Getting contract_name from URL

    if (contract_name) {
        // Fetch contract_title and content from Contract Content doctype
        frappe.call({
            method: 'frappe.client.get_list',
            args: {
                doctype: 'Contract Content',
                filters: { 'name': contract_name }, // Using contract_name as the filter
                fields: ['contract_title', 'content']
            },
            callback: function(response) {
                console.log("API Response:", response.message); // Debugging

                if (response.message && response.message.length > 0) {
                    let data = response.message[0];

                    // Set contract_title if available
                    let titleField = $('[data-fieldname="contract_title"]');
                    if (titleField.length > 0 && data.contract_title) {
                        titleField.val(data.contract_title).prop('readonly', true);
                    } else {
                        console.warn("contract_title is missing from the response.");
                    }

                    // Set content if available
                    let contentField = $('[data-fieldname="content"]');
                    if (contentField.length > 0 && data.content) {
                        contentField.val(data.content);
                    }
                } else {
                    console.warn("No matching contract found for name:", contract_name);
                }
            },
            error: function(err) {
                console.error("Frappe API Error:", err);
            }
        });
    }
});