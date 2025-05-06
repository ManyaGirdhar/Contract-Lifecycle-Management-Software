frappe.ready(function() {
    // Apply custom styling
    const style = document.createElement('style');
    style.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap');

        body {
            font-family: 'Inter', sans-serif;
            background: #fef9ef;
            color: #5C4033;
        }

        .web-form-wrapper {
            max-width: 720px;
            margin: 40px auto;
            background: #fff;
            padding: 40px;
            border-radius: 16px;
            box-shadow: 0px 12px 30px rgba(0, 0, 0, 0.2);
            animation: fadeIn 0.4s ease-in-out;
        }

        .web-form-header {
            font-size: 16px;
            font-weight: 600;
            color: #5C4033;
            text-align: center;
            margin-bottom: 30px;
        }

        .form-group {
            margin-bottom: 24px;
        }

        .control-label {
            font-size: 13px;
            font-weight: 500;
            color: #7c5b47;
            margin-bottom: 6px;
        }

        .form-control {
            border-radius: 10px;
            border: 1px solid #ccc;
            background-color: #fef9ef;
            color: #5C4033;
            padding: 10px 14px;
            font-size: 14px;
            transition: border 0.2s ease, box-shadow 0.2s ease;
        }

        .form-control:focus {
            border-color: #5C4033;
            box-shadow: 0 0 0 3px rgba(92, 64, 51, 0.25);
            background-color: #fff;
        }

        .btn-primary {
            background-color: #5C4033;
            border: none;
            color: #ffffff;
            font-weight: 500;
            border-radius: 10px;
            padding: 10px 24px;
            font-size: 15px;
            transition: background-color 0.2s ease, transform 0.2s ease;
        }

        .btn-primary:hover {
            background-color: #4a3329;
            transform: translateY(-1px);
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .success-page .success-body .success-message {
            color: #5C4033;
        }

        .phone-picker .search-phones input[type=search] {
            color: #5C4033;
        }

        .msgprint {
            color: #5C4033;
        }
    `;
    document.head.appendChild(style);

    const loggedInUser = frappe.session.user;
    console.log(loggedInUser);
    // frappe.web_form.set_value('requester_name', frappe.session.full_name);

    // Set requester email
    frappe.web_form.set_value('requester_email', "");

    // Fetch full name using frappe call (frappe.session.user doesn't contain full_name directly)
    frappe.call({
        method: 'frappe.client.get',
        args: {
            doctype: 'User',
            name: loggedInUser
        },
        callback: function (r) {
            if (r.message && r.message.full_name) {
                console.log(r.message);
                frappe.web_form.set_value('requester_name', r.message.full_name);
                frappe.web_form.set_value('requester_email', r.message.name);
            }
        }
    });

    // You can bind other form events below
});