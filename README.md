# Django REST API – Backend Project

## Overview

This project is a **RESTful API built with Django and Django REST Framework**, developed with a **backend-first approach**.

The main goal of the project is to demonstrate backend fundamentals such as authentication, authorization, user-based permissions, secure configuration, and clean API design.  
The frontend is intentionally minimal and is not the focus of this project.

---

## Tech Stack

- Python
- Django
- Django REST Framework
- JWT Authentication (djangorestframework-simplejwt)
- MySQL
- python-dotenv
- django-cors-headers

---

## Features

- JWT-based authentication
- Protected API endpoints
- User-scoped data access
- Secure configuration using environment variables
- RESTful API design

---

## Authentication

Authentication is handled using **JWT (JSON Web Tokens)**.

### Authentication flow

1. The user logs in and receives an access token
2. The token must be sent in every protected request using the header:
   ```
   Authorization: Bearer <access_token>
   ```
3. Only authenticated users can access protected endpoints

---

## Permissions and Data Isolation

All protected views enforce:

- `IsAuthenticated` permission
- Queryset filtering based on the authenticated user

This ensures that users **can only access their own data**, preventing unauthorized access to other users' resources.

---

## Environment Variables

Sensitive configuration is managed using environment variables.

Create a `.env` file in the project root:

```env
SECRET_KEY=your-secret-key
DEBUG=True

DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=3306
```

An example file is provided as `.env.example`.

---

## Installation and Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd <project-folder>
```

### 2. Create and activate a virtual environment

```bash
python -m venv .venv
source .venv/bin/activate  # Linux / macOS
.venv\Scripts\activate     # Windows
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Apply migrations

```bash
python manage.py migrate
```

### 5. Run the development server

```bash
python manage.py runserver
```

---

## API Endpoints

### Authentication

- `POST /api/auth/token/`  
  Obtain access and refresh tokens

- `POST /api/auth/token/refresh/`  
  Refresh an access token

### Example protected endpoint

- `GET /api/categories/`  
  Returns only the categories belonging to the authenticated user

> All protected endpoints require a valid JWT token.

---

## Project Focus

This project was built with a strong focus on backend development:

- Authentication and authorization
- Secure handling of sensitive configuration
- Clean separation of concerns
- User-based access control

The frontend is intentionally simple and only serves as a basic interface to interact with the API.
