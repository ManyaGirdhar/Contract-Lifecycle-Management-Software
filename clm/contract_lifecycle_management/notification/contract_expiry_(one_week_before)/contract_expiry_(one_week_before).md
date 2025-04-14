<p>Dear {{ doc.requester_name or "Team" }},</p>

<p>This is a reminder that the contract titled <strong>{{ doc.title }}</strong> (ID: {{ doc.name }}) is set to expire on <strong>{{ frappe.utils.format_date(doc.end_date, "d MMMM, yyyy") }}</strong>.</p>

<p><strong>Only one week is left until expiration.</strong> Please take the necessary action if renewal or closure is required.</p>

<hr>

<h4>Contract Summary</h4>
<ul>
  <li><strong>Contract ID:</strong> {{ doc.name }}</li>
  <li><strong>Title:</strong> {{ doc.title }}</li>
  <li><strong>Status:</strong> {{ doc.workflow_state }}</li>
  <li><strong>Start Date:</strong> {{ frappe.utils.format_date(doc.effective_date) }}</li>
  <li><strong>End Date:</strong> {{ frappe.utils.format_date(doc.end_date) }}</li>
</ul>

<hr>

<p>If you have any questions or need support, please contact the Contract Manager.</p>

<p style="font-size: 0.9em; color: #666;">This is an automated message. Please do not reply to this email.</p>
