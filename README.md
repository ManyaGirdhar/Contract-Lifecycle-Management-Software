# 📝 Contract Lifecycle Manager (CLM)

A **Frappe-based application** that simplifies and automates the entire contract lifecycle — from request to signature — enabling **seamless collaboration** between Contract Managers and Counterparties.

---

![CLM Banner](.github/i1.png)  
<sub>*Visual suggestion: Add a high-level dashboard or contract flow concept here*</sub>

---

## 🚀 Features

### 🔐 Role-Based Access Control

- 👩‍💼 **Contract Manager**  
  Manage workflows, templates, and approvals with full access to the Frappe Desk.

- 🧑‍💻 **Counterparty**  
  Submit requests, negotiate terms, and track contract status through a dedicated UI portal.

---

### 🌀 Contract Workflow Stages

> **Request** → **Draft** → **Approved** → **In Negotiation** → **Legal Review** → **Modified** → **Final Approval** → **Negotiated** → **Awaiting Signature** → **Active** → **Expired** → **Rejected**

---

### 📣 Smart Notifications

- Automated alerts triggered at every key stage  
- Notifies requesters, legal teams, and signees to take timely actions

---

### 💬 Real-Time Collaboration

- Inline comments and discussion threads  
- Contract redlining and change proposals with live updates

---

### 🧠 Gemini AI Integration

- Intelligent **contract summarization** for both parties  
- Quick insights into critical clauses and terms

---

### 📜 Version Control

- Transparent **change tracking**  
- Full visibility of edits, redlines, and approvals

---

### ✍️ Documenso Integration

- Sign contracts **anytime, anywhere** with secure digital signature support

---

## 🌐 User Interface

### 🔸 Counterparty Portal

> *A minimal, intuitive portal where counterparties can view contract lists, track status, initiate negotiations, and leave comments.*

---

### 🔹 Contract Manager Desk

> Full access through the Frappe Desk UI to manage all aspects of the contract lifecycle.

![Contract Manager Desk](docs/images/contract-manager-desk.png)  
![Contracts List](.github/i3.png)  
![Contract Versions](.github/i4.png)  
<sub>*Screenshots showcase contract workflows, statuses, and version history.*</sub>

---

## 🛠️ Installation Guide

```bash
# Initialize the bench
bench init frappe-bench
cd frappe-bench

# Get the CLM app
bench get-app clm https://github.com/yourusername/clm.git

# Create a new site
bench new-site clm.localhost

# Install the app
bench --site clm.local install-app clm

# Start the Frappe development server
bench start
