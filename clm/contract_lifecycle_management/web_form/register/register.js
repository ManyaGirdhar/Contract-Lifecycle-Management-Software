frappe.ready(() => {
    const style = document.createElement('style');
    style.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap');

        body {
            font-family: 'Inter', sans-serif;
            background: oklch(98.7% 0.026 102.212);
            color: #f8fafc;
        }

        .web-form-wrapper {
            max-width: 720px;
            margin: 40px auto;
            background: #264e36;
            padding: 40px;
            border-radius: 16px;
            box-shadow: 0px 12px 30px rgba(0, 0, 0, 0.4);
            animation: fadeIn 0.4s ease-in-out;
        }

        .web-form-header {
            font-size: 16px;
            font-weight: 600;
            color: #ffffff;
            text-align: center;
            margin-bottom: 30px;
        }

        .form-group {
            margin-bottom: 24px;
        }

        .control-label {
            font-size: 13px;
            font-weight: 500;
            color: #cbd5e1;
            margin-bottom: 6px;
        }

        .form-control {
            border-radius: 10px;
            border: 1px solid #334155;
            background-color: #0f172a;
            color: #f1f5f9;
            padding: 10px 14px;
            font-size: 14px;
            transition: border 0.2s ease, box-shadow 0.2s ease;
        }

        .form-control:focus {
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
            background-color: #1e293b;
        }

        .btn-primary {
            background-color: #3b82f6;
            border: none;
            color: #ffffff;
            font-weight: 500;
            border-radius: 10px;
            padding: 10px 24px;
            font-size: 15px;
            transition: background-color 0.2s ease, transform 0.2s ease;
        }

        .btn-primary:hover {
            background-color: #2563eb;
            transform: translateY(-1px);
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .success-page .success-body .success-message {
            color: #1e293b;
        }

        .phone-picker .search-phones input[type=search] {
            color: white;
        }

        .msgprint {
            color: #1e293b;
        }

    `;
    document.head.appendChild(style);
});