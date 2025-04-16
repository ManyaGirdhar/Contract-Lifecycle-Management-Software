Dear {{frappe.get_doc("CounterParty", counterparty_name).member_name}},

The contract titled "{{ doc.title }}" has now reached the Legal Review stage and requires your attention.
Kindly review the details and provide your feedback or take necessary action at your earliest convenience.

🔗 Contract Link: [Click here to view the contract](https://your-platform-url.com/contracts/{{ doc.name }})
Please feel free to reach out if you have any questions or need further information.

Best regards,
{{frappe.get_doc("Contract Request", request_id).requester_name}}
{{doc.counterparty_name}}