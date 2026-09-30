# LUXOR

**LUXOR** is a full-stack e-commerce application built with **React** and **Spring Boot**, backed by **MySQL**.

It provides a complete customer shopping experience together with a secure, role-based administration system for managing products, categories, orders, inventory, and users.

---

## Overview

```text
React Frontend
      │
      │ REST API + JWT
      ▼
Spring Boot Backend
      │
      │ Spring Data JPA / Hibernate
      ▼
MySQL Database
```

The application supports two roles:

- **USER** — browse products, manage cart, checkout, and view personal orders.
- **ADMIN** — manage products, categories, orders, inventory, and user roles.

---

## Features

### Customer

- User registration and login
- JWT authentication with refresh-token flow
- Product browsing
- Category browsing and filtering
- Product details
- Shopping cart
- Checkout and order placement
- Order history and order details
- User profile
- Responsive storefront

### Admin

- Protected admin dashboard
- Product management
  - Create
  - Update
  - Delete
- Category management
  - Create
  - Update
  - Delete
- Order management
  - View all orders
  - View order details
  - Update order status
- User management
  - View users
  - Promote USER → ADMIN
  - Demote ADMIN → USER
- Inventory management through product stock
- Protected admin APIs

---

# Tech Stack

## Frontend

| Technology | Purpose |
|---|---|
| React | UI development |
| Vite | Build tool and development server |
| React Router | Client-side routing |
| Context API | Global authentication and cart state |
| JavaScript | Application logic |
| Tailwind CSS | Styling |

## Backend

| Technology | Purpose |
|---|---|
| Java | Backend language |
| Spring Boot | REST API framework |
| Spring Security | Authentication and authorization |
| Spring Data JPA | Persistence layer |
| Hibernate | ORM |
| JWT | Stateless authentication |
| MapStruct | DTO mapping |
| Lombok | Boilerplate reduction |
| Maven | Build and dependency management |

## Database

**MySQL**

---

# Architecture

LUXOR follows a layered backend architecture:

```text
                    ┌─────────────────────┐
                    │    React Frontend   │
                    │                     │
                    │ Pages / Components  │
                    │ Context / Routing   │
                    │ API Client          │
                    └──────────┬──────────┘
                               │
                           REST API
                               │
                               ▼
                    ┌─────────────────────┐
                    │     Controllers     │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      Services       │
                    │                     │
                    │ Business Logic      │
                    │ Validation          │
                    │ Transactions        │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    Repositories     │
                    │   Spring Data JPA   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │       MySQL         │
                    └─────────────────────┘
```

---

# Backend Structure

```text
backend/
└── src/
    └── main/
        ├── java/
        │   └── com/luxor/shoppingcartapi/
        │       ├── Controller/
        │       ├── Entities/
        │       ├── Mappers/
        │       ├── Security/
        │       ├── dtos/
        │       ├── repositories/
        │       ├── service/
        │       └── exception/
        │
        └── resources/
            └── application.properties
```

### Controllers
Expose REST endpoints and handle HTTP requests.

### Services
Contain application and business logic.

### Repositories
Provide database access through Spring Data JPA.

### Entities
Represent database tables and relationships.

### DTOs
Define the data exchanged between frontend and backend.

### Mappers
Map entities and DTOs using MapStruct.

### Security
Contains Spring Security configuration, JWT handling, authentication, and authorization.

### Exception Handling
Provides consistent API error responses.

---

# Frontend Structure

```text
frontend/
└── src/
    ├── api/
    ├── assets/
    ├── components/
    │   └── admin/
    ├── context/
    ├── pages/
    │   └── admin/
    ├── routes/
    ├── services/
    ├── App.jsx
    ├── index.css
    └── main.jsx
```

### Context

Global application state such as:

- Authentication
- Current user
- Shopping cart

### Components

Reusable UI elements and layouts.

### Pages

Application screens such as:

- Home
- Shop
- Categories
- Product Details
- Cart
- Checkout
- Orders
- Profile
- Admin Dashboard

### Routes

React Router configuration and protected route handling.

---

# Authentication

LUXOR uses stateless JWT authentication.

```text
User
 │
 │ Login
 ▼
AuthController
 │
 ▼
AuthenticationManager
 │
 ├── Load User
 └── Verify BCrypt Password
 │
 ▼
JWT Access Token
 │
 ▼
React Frontend
```

For authenticated API requests:

```text
React
  │
  │ Authorization: Bearer <JWT>
  ▼
JwtAuthFilter
  │
  ├── Extract token
  ├── Validate token
  ├── Load user
  └── Set SecurityContext
  │
  ▼
Controller
```

The application also uses a refresh-token flow so users can obtain a new access token without repeatedly logging in.

---

# Role-Based Authorization

LUXOR has two roles:

```text
USER
ADMIN
```

Admin access is protected on both frontend and backend.

### Frontend

`AdminRoute` checks the user's role before allowing access to `/admin/*`.

```text
USER  ───────────► /admin
                    │
                    ▼
                 Redirect

ADMIN ──────────► /admin
                    │
                    ▼
              Admin Dashboard
```

### Backend

The admin namespace is protected by Spring Security:

```text
/admin/**
     │
     ▼
hasRole("ADMIN")
```

Admin controllers also use method-level authorization such as:

```java
@PreAuthorize("hasRole('ADMIN')")
```

Frontend protection improves user experience, while backend authorization remains the actual security boundary.

---

# Shopping Flow

```text
Browse Products
       │
       ▼
Product Details
       │
       ▼
Add to Cart
       │
       ▼
Shopping Cart
       │
       ▼
Checkout
       │
       ▼
Create Order
       │
       ▼
Validate Stock
       │
       ▼
Create Order Items
       │
       ▼
Reduce Inventory
       │
       ▼
Clear Cart
       │
       ▼
My Orders
```

Order placement is handled by the backend service layer inside a transaction.

The system validates inventory during checkout rather than reducing stock merely because an item was added to a cart.

---

# Order Management

Orders follow controlled status transitions:

```text
             ┌──────────────┐
             │   PENDING    │
             └──────┬───────┘
                    │
          ┌─────────┴─────────┐
          ▼                   ▼
     CONFIRMED            CANCELLED
          │                   │
          ▼                   │
       SHIPPED                │
          │                   │
          ▼                   │
      DELIVERED               │
                              │
                              ▼
                         Restore Stock
```

The backend validates valid status transitions.

When an order is cancelled, its product quantities can be restored to inventory.

---

# Database Domain

The main domain objects are:

```text
User
 │
 └── Cart
      │
      └── CartItem
             │
             └── Product

User
 │
 └── Order
      │
      └── OrderItem
             │
             └── Product

Product
 │
 └── Category
```

JPA/Hibernate manages the entity relationships and persistence.

---

# DTO and Mapping

The application uses DTOs instead of exposing database entities directly through the REST API.

```text
Entity
  │
  ▼
MapStruct Mapper
  │
  ▼
DTO
  │
  ▼
REST Response
```

This keeps the persistence model separate from the API contract and prevents sensitive information such as password data from being returned.

---

# Admin System

The admin dashboard is available under:

```text
/admin
```

Navigation:

```text
Admin Dashboard
├── Product Management
├── Order Management
├── User Management
└── Category Management
```

### Product Management

Administrators can:

- Add products
- Edit products
- Delete products
- Change price
- Change stock
- Assign categories
- Update product information

### Order Management

Administrators can:

- View all orders
- View order details
- View customer information
- Update order status

### User Management

Administrators can:

- View registered users
- View roles
- Promote USER → ADMIN
- Demote ADMIN → USER

The system prevents an administrator from removing their own admin role.

### Category Management

Administrators can:

- Create categories
- Rename categories
- Delete categories

Categories containing products cannot be deleted until their products are reassigned or removed.

---

# API Overview

## Authentication

| Method | Endpoint | Access |
|---|---|---|
| POST | `/Auth/Login` | Public |
| POST | `/Auth/Refresh` | Refresh token |
| POST | `/Auth/Logout` | Authenticated |

## Users

| Method | Endpoint | Access |
|---|---|---|
| POST | `/user` | Public |
| GET | `/user/me` | Authenticated |

## Products

| Method | Endpoint | Access |
|---|---|---|
| GET | `/products` | Public |
| GET | `/products/{id}` | Public |
| POST | `/products` | ADMIN |
| PUT | `/products/{id}` | ADMIN |
| DELETE | `/products/{id}` | ADMIN |

## Categories

| Method | Endpoint | Access |
|---|---|---|
| GET | `/category` | Public |
| GET | `/admin/categories` | ADMIN |
| POST | `/admin/categories` | ADMIN |
| PUT | `/admin/categories/{id}` | ADMIN |
| DELETE | `/admin/categories/{id}` | ADMIN |

## Cart

| Method | Endpoint | Access |
|---|---|---|
| GET | `/cart` | Authenticated |
| POST | `/cart/items` | Authenticated |

## Orders

| Method | Endpoint | Access |
|---|---|---|
| POST | `/orders` | Authenticated |
| GET | `/orders` | Authenticated |
| GET | `/orders/{id}` | Authenticated |
| POST | `/orders/{id}/pay` | Authenticated |
| PATCH | `/orders/{id}/status` | ADMIN |

## Admin

| Method | Endpoint | Access |
|---|---|---|
| GET | `/admin/dashboard` | ADMIN |
| GET | `/admin/orders` | ADMIN |
| GET | `/admin/orders/{id}` | ADMIN |
| PATCH | `/admin/orders/{id}/status` | ADMIN |
| GET | `/admin/users` | ADMIN |
| PATCH | `/admin/users/{id}/role` | ADMIN |
| GET | `/admin/categories` | ADMIN |
| POST | `/admin/categories` | ADMIN |
| PUT | `/admin/categories/{id}` | ADMIN |
| DELETE | `/admin/categories/{id}` | ADMIN |

---

# Security Behavior

```text
No JWT
  │
  ▼
401 Unauthorized
```

```text
Valid USER JWT
       │
       ▼
Admin endpoint
       │
       ▼
403 Forbidden
```

```text
Valid ADMIN JWT
       │
       ▼
Admin endpoint
       │
       ▼
Successful response
```

---

# Error Handling

The backend provides consistent JSON error responses.

Example:

```json
{
  "error": "Access denied"
}
```

Business and validation errors are also returned through the global exception handling layer.

---

# Getting Started

## Requirements

Install:

- Java 17
- Maven
- Node.js
- npm
- MySQL

## Database

Create the MySQL database and configure the connection in:

```text
backend/src/main/resources/application.properties
```

Keep database credentials and JWT secrets outside source control.

## Start Backend

```bash
cd backend
mvn spring-boot:run
```

Backend:

```text
http://localhost:8080
```

## Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# Project Status

Current functionality includes:

- Customer storefront
- JWT authentication
- Refresh-token flow
- Product management
- Shopping cart
- Checkout
- Order management
- Inventory handling
- Category management
- User management
- Role management
- Admin dashboard
- Role-protected admin APIs
- Responsive frontend

Future improvements may include payment gateway integration, advanced analytics, automated testing, Docker deployment, cloud deployment, and production monitoring.

---

## Author

**Nihal Nayak**

Full-stack e-commerce project built with React, Spring Boot, Spring Security, JPA/Hibernate, and MySQL.
