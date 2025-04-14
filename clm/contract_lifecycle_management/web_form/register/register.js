frappe.ready(() => {
    const style = document.createElement("style");
    style.innerHTML = `
        body {
            background: #eafaf1 !important; /* Soft pastel green */
            font-family: 'Segoe UI', sans-serif;
        }

        .web-form-container {
            max-width: 700px;
            margin: 40px auto;
            background: #ffffff;
            padding: 40px 30px;
            border-radius: 16px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
            animation: fadeIn 0.5s ease-in-out;
        }

        .web-form-container h1, 
        .web-form-container h2 {
            color: #4caf50; /* Soft green */
            text-align: center;
            font-weight: 700;
            margin-bottom: 10px;
        }

        .web-form-container p {
            color: #4e5d52;
            text-align: center;
            font-size: 14px;
            margin-bottom: 25px;
        }

        .web-form .form-group {
            margin-bottom: 20px;
        }

        .web-form label {
            font-weight: 600;
        
            margin-bottom: 6px;
            display: block;
        }

        .web-form input.form-control, 
        .web-form select.form-control, 
        .web-form textarea.form-control {
            border-radius: 10px;
            padding: 12px 14px;
            border: 1px solid #c8e6c9;
            background: #f1fdf4;
            transition: all 0.3s ease;
        }

        .web-form input.form-control:focus, 
        .web-form select.form-control:focus, 
        .web-form textarea.form-control:focus {
            border-color: #81c784;
            background: #ffffff;
            box-shadow: 0 0 0 2px rgba(129,199,132,0.15);
        }

        .web-form .btn-primary {
            background-color:rgb(41, 99, 44); /* Soft leafy green */
            border-color: #81c784;
            color: #ffffff;
            border-radius: 8px;
            padding: 12px 24px;
            font-weight: 600;
            font-size: 16px;
            transition: 0.3s ease all;
            display: inline-block;
            margin-top: 10px;
        }

        .web-form .btn-primary:hover {
            background-color:rgb(51, 119, 54); /* Slightly darker but still soft */
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);
});