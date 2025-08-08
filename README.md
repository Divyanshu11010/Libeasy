# Libeasy RESTful API

**Libeasy** is a clean, modular backend system designed for modern library management. It exposes a RESTful API for powering any frontend—whether web, mobile, or third-party integration—while ensuring scalability, security, and maintainability.

---

## Table of Contents

- [Libeasy RESTful API](#libeasy-restful-api)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Key Features](#key-features)
  - [Tech Stack](#tech-stack)
  - [API Endpoints](#api-endpoints)
    - [**User Endpoints**](#user-endpoints)
    - [**Admin Endpoints**](#admin-endpoints)
  - [Installation \& Setup](#installation--setup)
  - [Usage Examples](#usage-examples)
    - [**User**](#user)
    - [**Admin**](#admin)
  - [API Request Collections](#api-request-collections)
  - [Authentication \& Error Handling](#authentication--error-handling)
  - [Testing](#testing)
  - [Contributing](#contributing)

---

## Overview

Libeasy acts as a robust backend service for managing library workflows. From book cataloguing and user management to borrowing and returning, the API follows REST principles for predictable, client-friendly communication. It’s built to be easily extendable—allowing additional services like notifications, reports, or analytics to be added with minimal effort.

---

## Key Features

* **Modular Architecture** — Clean separation of concerns for maintainable and scalable code.
* **RESTful Endpoints** — Consistent, predictable API routes for easy integration.
* **User & Admin Management** — Role-based access, authentication, and session handling.
* **Library Management** — Full CRUD support for books, catalogues, and borrowing.
* **Smart Notifications (Coming Soon)** — The API already has the hooks for sending real-time updates. Planned enhancements include alerts for overdue items, reserved book availability, and request status updates.
* **Extensible Design** — Built to integrate with external services, microservices, or multiple database backends.

---

## Tech Stack

* **Language & Runtime:** JavaScript (Node.js)
* **Framework:** Express.js
* **Database:** Flexible database using Prisma
* **Authentication:** JSON Web Tokens (JWT)
* **Validation:** express-validator / Joi
* **Development Tools:** Node.js, Nodemon, thunder-client

---

## API Endpoints

### **User Endpoints**

| Action            | Method | Endpoint                             |
| ----------------- | ------ | ------------------------------------ |
| Get OTP           | POST   | `/get-otp?type=user`                 |
| Signup            | POST   | `/signup/user?type=user`             |
| Login             | POST   | `/login/user`                        |
| Get all books     | GET    | `/user/all_books`                    |
| Request book      | POST   | `/user/ask/:bookId`                  |
| Get issued books  | GET    | `/user/issued`                       |
| Get profile       | GET    | `/user/profile`                      |
| Update profile    | PUT    | `/user/profile`                      |
| Get notifications | GET    | `/user/notification`                 |
| Read notification | DELETE | `/user/notification/:notificationId` |
| Logout            | DELETE | `/user/logout`                       |

---

### **Admin Endpoints**

| Action               | Method | Endpoint                              |
| -------------------- | ------ | ------------------------------------- |
| Get OTP              | POST   | `/get-otp?type=admin`                 |
| Signup               | POST   | `/signup/admin?type=admin`            |
| Login                | POST   | `/login/admin`                        |
| Add book             | POST   | `/admin/add_book`                     |
| Remove book          | DELETE | `/admin/remove_book/:bookId`          |
| Get all books        | GET    | `/admin/all_books`                    |
| Get all issued books | GET    | `/admin/issued_books`                 |
| Get all users        | GET    | `/admin/user_list`                    |
| View issue requests  | GET    | `/admin/requests`                     |
| Approve issue        | PUT    | `/admin/issue/:requestId`             |
| Reject issue         | POST   | `/admin/reject/:requestId`            |
| Accept return        | DELETE | `/admin/return/:requestId`            |
| Get notifications    | GET    | `/admin/notification`                 |
| Read notification    | DELETE | `/admin/notification/:notificationId` |
| Logout               | DELETE | `/admin/logout`                       |

---

## Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/Divyanshu11010/Libeasy.git
   cd Libeasy
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file:

   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/libeasy
   JWT_SECRET=your_secret_key
   ```

4. **Start the server**

   ```bash
   npm start
   ```

---

## Usage Examples

### **User**

```http
### Get OTP
POST http://localhost:5000/get-otp?type=user
Content-Type: application/json

{
    "email": "user@example.com"
}

### Signup
POST http://localhost:5000/signup/user?type=user
Content-Type: application/json

{
    "email": "user@example.com",
    "contact": "9876543210",
    "username": "alice",
    "password": "secure123",
    "otp": "123456"
}

### Login
POST http://localhost:5000/login/user
Content-Type: application/json

{
    "username": "alice",
    "password": "secure123"
}

### Get all books
GET http://localhost:5000/user/all_books

### Request a book
POST http://localhost:5000/user/ask/6661527100d54b313ebe7c56

### Get issued books
GET http://localhost:5000/user/issued

### Get profile
GET http://localhost:5000/user/profile

### Update profile
PUT http://localhost:5000/user/profile
Content-Type: application/json

{
    "name": "Alice Johnson",
    "idCard": "ID123456789"
}

### Get notifications
GET http://localhost:5000/user/notification

### Read a notification
DELETE http://localhost:5000/user/notification/66d97ad26902dd63e58b96dc

### Logout
DELETE http://localhost:5000/user/logout
```

---

### **Admin**

```http
### Get OTP
POST http://localhost:5000/get-otp?type=admin
Content-Type: application/json

{
    "email": "admin@example.com"
}

### Signup
POST http://localhost:5000/signup/admin?type=admin
Content-Type: application/json

{
    "email": "admin@example.com",
    "username": "admin1",
    "password": "adminpass",
    "adminOTP": "OFFICE123",
    "otp": "123456"
}

### Login
POST http://localhost:5000/login/admin
Content-Type: application/json

{
    "username": "admin1",
    "password": "adminpass"
}

### Add a book
POST http://localhost:5000/admin/add_book
Content-Type: application/json

{
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "ISBN": "9780743273565",
    "details": "Classic novel set in the 1920s"
}

### Remove a book
DELETE http://localhost:5000/admin/remove_book/66601afdc0cd4ce0c6358941

### Get all books
GET http://localhost:5000/admin/all_books

### Get all issued books
GET http://localhost:5000/admin/issued_books

### Get all users
GET http://localhost:5000/admin/user_list

### View issue requests
GET http://localhost:5000/admin/requests

### Approve an issue
PUT http://localhost:5000/admin/issue/66ddd7a1a14ecc265e3d6706

### Reject an issue
POST http://localhost:5000/admin/reject/66ddd385cff93243dba3317f

### Accept return
DELETE http://localhost:5000/admin/return/66ddd7a1a14ecc265e3d6706

### Get notifications
GET http://localhost:5000/admin/notification

### Read a notification
DELETE http://localhost:5000/admin/notification/66ddb84dc2e54bbc1ce1893f

### Logout
DELETE http://localhost:5000/admin/logout
```

---

## API Request Collections

Ready-to-use `.http` files are available for quick testing:

* **[User API Requests](./requests/userRequests.http)** – User signup, login, book requests, and profile management.
* **[Admin API Requests](./requests/adminRequests.http)** – Admin authentication, book management, issue handling, and notifications.

---

## Authentication & Error Handling

* **Authentication:** Protected endpoints require a valid JWT:

  ```
  Authorization: Bearer <token>
  ```
* **Error Response:**

  ```json
  {
    "error": "Book not found",
    "status": 404
  }
  ```

---

## Testing

* **Manual:** Use Postman, Insomnia, or VS Code REST Client with the provided `.http` files.
* **Automated:** Use Jest + Supertest for API tests.

---

## Contributing

We welcome contributions!

1. Fork this repo
2. Create a branch (`feature/xyz`)
3. Add your changes and tests
4. Commit and push
5. Open a pull request