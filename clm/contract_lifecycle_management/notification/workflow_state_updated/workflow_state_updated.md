<p><!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Contract Workflow Update</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 40px;
      background-color: #f9f9f9;
    }</p>

<pre><code>h2 {
  color: #333;
}

.timeline {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin: 30px 0;
  padding: 30px 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  overflow-x: auto;
}

.timeline::before {
  content: '';
  position: absolute;
  top: 55px;
  left: 10%;
  right: 10%;
  height: 4px;
  background: #e0e0e0;
  z-index: 0;
}

.phase {
  flex: 1;
  text-align: center;
  position: relative;
  z-index: 1;
  min-width: 100px;
}

.circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #ccc;
  margin: 0 auto 10px auto;
  line-height: 40px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  z-index: 2;
  position: relative;
}

.phase span {
  display: block;
  font-size: 14px;
  color: #666;
}

.current .circle {
  background-color: #007bff;
}

.current span {
  font-weight: bold;
  color: #007bff;
}

.email-body {
  background: #fff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  margin-top: 30px;
}

.footer {
  margin-top: 30px;
  font-size: 0.9em;
  color: #555;
}
</code></pre>

<p></style>
</head>
<body>
  <h2>Contract Workflow Status Updated</h2></p>

<p><div class="email-body">
    <p>Dear {{ doc.requester_name or "Team" }},</p></p>

<p>This is to inform you that the contract titled <strong>{{ doc.title }}</strong> (ID: {{ doc.name }}) has progressed to the following workflow state:</p>

<h4 style="color:#007bff;">Current Status: {{ doc.workflow_state }}</h4>

<table style="width:100%; border-spacing: 10px;">
  <tr>
    {% set current_state = doc.workflow_state %}
    {% set states = [
      "Draft", 
      "Approved", 
      "In Negotiation", 
      "Legal Review", 
      "Modified", 
      "Final Approval", 
      "Negotiated", 
      "Awaiting Signature", 
      "Active", 
      "Expired", 
      "Rejected"
    ] %}

    {% set current_index = states.index(current_state) %}

    {% for state in states %}
      {% set color = "#ccc" %}
      {% if loop.index0 < current_index %}
        {% set color = "#17a2b8" %}
      {% elif loop.index0 == current_index %}
        {% if state == "Active" %}
          {% set color = "#28a745" %}
        {% elif state == "Expired" or state == "Rejected" %}
          {% set color = "#dc3545" %}
        {% else %}
          {% set color = "#007bff" %}
        {% endif %}
      {% endif %}
      <td align="center">
        <div style="background-color:{{ color }}; width:40px; height:40px; border-radius:50%; color:white; line-height:40px;">
          {{ loop.index }}
        </div>
        <div style="font-size:12px; max-width:80px;">{{ state }}</div>
      </td>
    {% endfor %}
  </tr>
</table>

<p>Last updated on: <strong>{{ frappe.utils.format_datetime(doc.modified, "d MMMM, yyyy at h:mm a") }}</strong></p>

<p>If you have any questions or need further assistance, please contact the Contract Manager.</p>

<p style="font-size: 0.9em; color: #666;">This is an automated message. Please do not reply to this email.</p>

<p></div>
</body>
</html></p>
