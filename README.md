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

Create a `.env` file in the **`finances_backend/` directory** (where `manage.py` is located):

```env
SECRET_KEY=your-secret-key
DEBUG=True

DB_NAME=finances_db
DB_USER=finances_user
DB_PASSWORD=your_db_password
DB_HOST=127.0.0.1
DB_PORT=3306
```

An example file is provided as `.env.example`.

> ⚠️ Make sure the database and user exist in MySQL and that the user has permissions on the database.

---

### Database Setup (MySQL)

Before running migrations, ensure MySQL is running and create the database and user:

```sql
CREATE DATABASE finances_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER 'finances_user'@'localhost' IDENTIFIED BY 'your_db_password';
GRANT ALL PRIVILEGES ON finances_db.* TO 'finances_user'@'localhost';
FLUSH PRIVILEGES;
```


## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/MarineEspacialArgentino/finances-backend-api
cd finances-backend-api
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
### 4. Configure environment variables

```bash
Create a .env file inside the finances_backend/ directory and define the required variables
(see Environment Variables section above).
```
### 5. Apply migrations

```bash
cd finances_backend
python manage.py migrate
```

### 6. Run the development server

```bash
python manage.py runserver
```

---

## 📌 API Endpoints

### Authentication

- `POST /api/auth/token/`  
  Obtain access and refresh tokens

- `POST /api/auth/token/refresh/`  
  Refresh an access token

### Example protected endpoint

- `GET /api/categorias/`  
  Returns only the categories belonging to the authenticated user

> All protected endpoints require a valid JWT token.

### Transactions

#### GET `/api/transacciones/`

Retrieves the authenticated user's transactions with filtering options.

**Query Parameters**

| Parameter | Type | Required | Description | Valid Values | Example |
|-----------|------|----------|-------------|--------------|---------|
| `type` | string | No | Filter by transaction category type | `income`, `expense` | `expense` |
| `last_30_days` | boolean | No | Filter transactions from last 30 days | `true`, `false` | `true` |

**Authentication**
```
Authorization: Bearer <access_token>
```

**Usage Examples**

```bash
# All transactions
GET /api/transacciones/

# Only expenses
GET /api/transacciones/?type=expense

# Last 30 days only
GET /api/transacciones/?last_30_days=true

# Combined: expenses from last 30 days
GET /api/transacciones/?type=expense&last_30_days=true
```

**cURL Example**
```bash
curl -X GET "http://localhost:8000/api/transacciones/?type=expense&last_30_days=true" \
  -H "Authorization: Bearer <your_token>"
```

**Response (200)**

```json
[
  {
    "id": 1,
    "amount": "100.50",
    "category": 3,
    "date": "2026-02-14",
    "description": "Salary payment",
    "user": 1
  }
]
```

---

#### POST `/api/transacciones/`

Creates a new transaction.

**Request Body**
```json
{
  "amount": "100.50",
  "category": 3,
  "description": "Optional description"
}
```

---

### Technical Implementation

```python name=views.py url=https://github.com/MarineEspacialArgentino/finances-backend-api/blob/d7e6e0a8b325523872a7e0ac2388806603c969b7/Finances_Backend/expenses/views.py#L32-L52
def get_queryset(self, transaction_type=None, last_30_days=False):
    user = self.request.user
    queryset = Transactions.objects.filter(user=user).select_related('category')

    transaction_type = self.request.query_params.get('type')
    last_30_days = self.request.query_params.get('last_30_days','').lower() == 'true'

    VALID_TRANSACTION_TYPES = ['income', 'expense']

    if transaction_type in VALID_TRANSACTION_TYPES:
        queryset = queryset.filter(category__type=transaction_type)

    if last_30_days:
        thirty_days_ago = timezone.now().date() - timedelta(days=30)
        queryset = queryset.filter(date__gte=thirty_days_ago)
    
    return queryset.order_by('-date')
```

**Key Points**
- 🔒 JWT authentication required
- ✅ Users only see their own transactions (`filter(user=user)`)
- 📊 Results ordered by date (newest first)
- ⚡ Optimized with `.select_related('category')` to prevent N+1 queries


## Frontend (Optional)

This project includes a minimal frontend used only to test and validate the backend API.

The frontend is **not required** to run or test the backend.

### Running the frontend

```bash
cd finances_react
npm install
npm run dev
```
The frontend will be available at:

http://localhost:5173

Make sure the backend is running at:

http://127.0.0.1:8000
---

## Project Focus

This project was built with a strong focus on backend development:

- Authentication and authorization
- Secure handling of sensitive configuration
- Clean separation of concerns
- User-based access control

The frontend is intentionally simple and only serves as a basic interface to interact with the API.
