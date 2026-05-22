# Mini ERP System

A  Mini ERP (Enterprise Resource Planning) System developed using **React + Vite** for the frontend and **FastAPI + SQLite** for the backend.
This project helps manage products, customers, sales, and inventory with dashboard analytics and low-stock alerts.

---

## Features

* User Login Authentication
* Dashboard with Sales Analytics
* Product Management
* Customer Management
* Sales Management
* Inventory Tracking
* Low Stock Alerts
* Responsive UI
* REST API Integration
* SQLite Database Support

---

# Tech Stack

## Frontend

* React.js
* Vite
* Axios
* Recharts
* CSS

## Backend

* FastAPI
* SQLite
* SQLAlchemy
* Uvicorn
* Python

---

# Project Structure

```bash
Mini_ERP/
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   └── ...
│
├── backend/
│   ├── main.py
│   ├── model.py
│   ├── db.py
│   ├── requirements.txt
│   └── ...
│
└── README.md
```

---

# Installation Guide

## 1. Clone Repository

```bash
git clone <your-github-repository-link>
cd Mini_ERP
```

---

# Frontend Setup

## Install Dependencies

```bash
cd frontend
npm install
```

## Run Frontend

```bash
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

# Backend Setup

## Create Virtual Environment

```bash
cd backend

python -m venv venv
```

## Activate Virtual Environment

### Windows

```bash
venv\Scripts\activate
```

### Linux/Mac

```bash
source venv/bin/activate
```

---

## Install Backend Dependencies

```bash
pip install -r requirements.txt
```

---

## Run Backend Server

```bash
uvicorn main:app --reload
```

Backend runs on:

```bash
http://127.0.0.1:8000
```

---

# API Testing

You can test APIs using:

* Postman
* FastAPI Swagger UI

Swagger URL:

```bash
http://127.0.0.1:8000/docs
```

---

# Main Modules

## Authentication

* User login validation
* Protected dashboard routes

## Product Module

* Add products
* Update products
* Delete products
* Stock management

## Customer Module

* Add customer details
* Manage customer records

## Sales Module

* Create sales entries
* Track sales history

## Dashboard

* Sales charts
* Customer statistics
* Product statistics
* Low stock notifications

---

# Database

This project uses SQLite database.

Main tables:

* Users
* Products
* Customers
* Sales

---

# Low Stock Alert Logic

The system automatically checks product quantity.

Example:

```text
If stock quantity < threshold value
→ Product appears in low stock alert section
```

---

# Security Features

* Login authentication
* Protected routes
* Backend API validation
* Error handling

---

# Future Improvements

* JWT Authentication
* Role-based access
* Export reports to PDF
* Email notifications
* Cloud database support
* Advanced analytics

---

# Author

Developed by Hanna Fathima

---


