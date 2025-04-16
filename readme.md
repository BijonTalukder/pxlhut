# 📦 Pxlhut Backend API

Backend API for **Pxlhut**, built with **Node.js**, **Express**, **MongoDB**, and **Stripe**. This API supports user authentication with JWT, role-based access control (admin/user), and secure Stripe payments.


---

## 🚀 Features

- ✅ User registration & login
- ✅ JWT-based authentication
- ✅ Role-based access control (RBAC)
- ✅ Stripe payment integration
- ✅ Secure token handling
- ✅ Mongoose error handling
- ✅ Centralized global error handler
- ✅ Unit testing with Jest

---

## 🛠️ Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB + Mongoose**
- **Passport.js + JWT**
- **Stripe**
- **Jest** (for testing)

---

## 📁 Folder Structure

```
src/
├── Controllers/
│   └── userController.js
│   └── orderController.js
├── Middlewares/
│   └── verifyToken.js
│   └── permission.js
├── Models/
│   └── userModel.js
│   └── orderModel.js
├── Services/
│   └── userService.js
│   └── orderService.js
├── shared/
│   └── jwtHandaler.js
│   └── response.handaler.js
│   └── catchAsync.js
│   └── handleApiError.js
├── error/
│   └── globalErrorHandler.js
├── index.js
└── routes.js
```

---

## 📦 Setup & Run

### 1. Clone the Repository

```bash
git clone 
https://github.com/BijonTalukder/pxlhut.git
cd pxlhut
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Environment Variables

Create a `.env` file in the root:

```env
PORT=5000
MONGODB_URI=your_mongodb_uri
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
NODE_ENV=development
```
#or copy from env.local

### 4. Run the Server

```bash
npm start
```

Server will run at: `http://localhost:3000`

---

## ✅ Running Tests

Unit tests use **Jest**:

```bash
npm test
```

---
## BaseUrl `http://localhost:3000/api/v1`


## download postman json and import it
## 🔐 API Endpoints

> Use `authorization: Bearer <accessToken>` for protected routes.

### 🔹 Register User (Admin Only)

```
POST /auth/register
```

**Headers:**
```
authorization: Bearer <admin_access_token>
```

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePass"
}
```

---

### 🔹 Login

```
POST /auth/login
```

**Body:**
```json
{
  "email": "john@example.com",
  "password": "securePass"
}
```

**Response:**
```json
{
  "user": { "_id": "userId", "email": "john@example.com", "role": "user" },
  "accessToken": "jwt_token_here",
  "refreshToken": "refresh_token_here"
}
```

---

### 🔹 Get Profile

```
GET /auth/me
```

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response:**
```json
{
  "user": { "_id": "userId", "email": "john@example.com", "name": "John Doe" }
}
```

---

## 💳 Stripe Payment Routes

### 🔹 Create Order + Checkout

```
POST /payments/checkout
```

**Body:**
```json
{
  "items": [
    { "name": "Logo Design", "price": 5000, "quantity": 1 }
  ],
  "userId": "user_id_here"
}
```

**Response:**
Stripe checkout session URL or order info

---

### 🔹 Payment Success

```
GET /success
```

Used as redirect URL after successful Stripe checkout

---

## 🛡️ Role-Based Permission Middleware

You can protect routes using roles like:

```js
router.post('/auth/register', verifyToken, permission('admin'), controllerFn);
```

If a user does not have the required role, a 403 error is returned.

---

## 🐞 Global Error Handling

All server errors are handled by a centralized `globalErrorHandler.js` middleware.

Handles:
- Mongoose Validation Errors
- Cast Errors
- Custom API Errors
- Unhandled Runtime Errors

---

## 🧪 Example Test (Jest)

```js
const permission = require("../src/middlewares/permission");

describe("Permission Middleware", () => {
  test("should return 401 if no user is present", () => {
    const req = {};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    permission("admin")(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized: No user found" });
  });
});
```

---

## 📬 Contact

Built by [Your Name](https://github.com/your-username)  
For issues, open a GitHub issue or contact directly.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).