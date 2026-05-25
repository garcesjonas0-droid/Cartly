# 🛒 Cartly — Modern Mobile Shopping App

> A full-stack e-commerce web application for buying mobile phones and accessories online.
> Built for **ITEC 60 - Integrated Programming and Technologies 1**

---

## 👨‍💻 Developers

| Role | Name |
|------|------|
| Backend Developer | Barias, Joseph L. |
| Frontend Developer | Garces, Jonas |

---

## 📖 Project Description

**Cartly** is a full-stack online shopping platform focused on mobile phones and accessories. It allows users to browse products, add items to their cart, place orders, and track their order history — all through a modern, responsive dark-themed interface.

The platform supports two types of users:
- **Regular Users** — can register, login, browse products, manage their cart, place and cancel orders, and update their profile.
- **Admin Users** — can add, update, and delete products, and manage all orders across the platform.

Cartly was built using a **Node.js + Express** backend connected to a **MongoDB Atlas** cloud database, with a vanilla HTML/CSS/JavaScript frontend served via Live Server during development.

---

## 🗄️ Database Used

**MongoDB Atlas** (Cloud-hosted NoSQL Database)

- **Cluster:** Cluster0 (AWS / Hong Kong ap-east-1)
- **Database Name:** `cartly`
- **Collections:**
  - `users` — stores registered user accounts
  - `products` — stores all product listings
  - `orders` — stores all placed orders

---

## 🚀 Features

- 🔐 User Registration and Login
- 🔑 **JWT Authentication** (JSON Web Token) — secure token-based session management
- 🌐 **Google OAuth 2.0 Login** — sign in with Google account via Passport.js
- 🛍️ Product browsing with search, category filter, and sort
- 🛒 Cart management (add, remove, update quantity)
- 📦 Order placement with delivery address and payment method
- ❌ Order cancellation (pending/processing orders only)
- 👤 User profile with editable name and email
- 🔒 Role-based access control (Admin vs Regular User)
- 📱 Responsive design for mobile and desktop
- ✨ Page transition animations and scroll reveal effects
- 🔍 Scroll spy navigation highlighting

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML, CSS, Vanilla JavaScript |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Authentication | JWT (jsonwebtoken), Passport.js (Google OAuth 2.0) |
| Security | Helmet.js, express-rate-limit, bcryptjs |
| Dev Tools | VS Code, Thunder Client, Live Server, MongoDB Compass |

---

## ⚙️ Setup Instructions

### Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/) v18 or higher
- [Git](https://git-scm.com/)
- A [MongoDB Atlas](https://www.mongodb.com/atlas) account
- A [Google Cloud Console](https://console.cloud.google.com/) account (for Google OAuth)

---

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/(https://github.com/garcesjonas0-droid/Cartly).git
cd (https://github.com/garcesjonas0-droid/Cartly)
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Set Up Environment Variables

Create a `.env` file in the root directory and fill in the following:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxxx.mongodb.net/cartly?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your_super_secret_key_change_this_in_production_min_32_chars
CLIENT_ORIGIN=http://127.0.0.1:5500
NODE_ENV=development
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

> ⚠️ Never commit your `.env` file to GitHub. It is already listed in `.gitignore`.

---

### 4. Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a free cluster
3. Create a database user under **Security → Database Access**
4. Whitelist your IP under **Security → Network Access** (use `0.0.0.0/0` for development)
5. Copy your connection string into `MONGO_URI` in your `.env`

---

### 5. Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project named `Cartly`
3. Go to **APIs & Services → OAuth Consent Screen** → choose External
4. Go to **Credentials → Create Credentials → OAuth 2.0 Client ID**
5. Set **Authorized redirect URI** to: `http://localhost:5000/api/auth/google/callback`
6. Copy the **Client ID** and **Client Secret** into your `.env`

---

### 6. Run the Backend Server

```bash
node server.js
```

You should see:
```
🚀 Server running at http://localhost:5000
✅ MongoDB connected
```

---

### 7. Run the Frontend

Open **VS Code**, right-click `index.html` → **Open with Live Server**

Your app will be available at:
```
http://127.0.0.1:5500/index.html
```

---

### 8. Create an Admin Account

1. Register a new account on the site
2. Go to **MongoDB Atlas → Browse Collections → cartly → users**
3. Find your user and set `isAdmin` to `true`
4. Log out and log back in to get a fresh admin token

---

## 🔐 Advanced Features

### 1. JWT Authentication (JSON Web Token)

All protected routes require a valid JWT token passed in the `Authorization` header as a Bearer token. Tokens are generated upon login and expire after **7 days**.

```
Authorization: Bearer <token>
```

- Tokens are stored in `localStorage` on the client
- All API requests to protected routes include the token via `authHeaders()`
- Admin-only routes are protected by both `verifyToken` and `adminOnly` middleware

### 2. Google OAuth 2.0 Login

Users can sign in using their Google account without creating a password. Implemented using **Passport.js** with the `passport-google-oauth20` strategy.

**Flow:**
1. User clicks "Continue with Google"
2. Redirected to Google's OAuth consent screen
3. Google sends back user profile to our callback URL
4. Server finds or creates the user in the database
5. A JWT token is generated and sent back to the frontend
6. User is logged in automatically

---

## 📁 Project Structure

```
cartly/
├── controllers/
│   ├── authController.js
│   ├── orderController.js
│   ├── productController.js
│   └── userController.js
├── middleware/
│   └── authMiddleware.js
├── models/
│   ├── Order.js
│   ├── Product.js
│   └── User.js
├── routes/
│   ├── authRoutes.js
│   ├── orderRoutes.js
│   ├── productRoutes.js
│   └── userRoutes.js
├── animations.css
├── app.js
├── cart.html
├── index.html
├── login.html
├── logo.png
├── orders.html
├── passport.js
├── profile.html
├── server.js
├── style.css
├── .env          ← not included in repo
├── .gitignore
└── README.md
```

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | User |
| PUT | `/api/auth/me` | User |
| GET | `/api/auth/google` | Public |
| GET | `/api/auth/google/callback` | Public |

### Products
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/products` | Public |
| GET | `/api/products/:id` | Public |
| POST | `/api/products` | Admin |
| PUT | `/api/products/:id` | Admin |
| DELETE | `/api/products/:id` | Admin |

### Orders
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/orders` | User |
| GET | `/api/orders/myorders` | User |
| PUT | `/api/orders/:id/cancel` | User |
| GET | `/api/orders` | Admin |
| PUT | `/api/orders/:id` | Admin |
| DELETE | `/api/orders/:id` | Admin |

---

## 📸 Screenshots

> Add screenshots of your app here after deployment.

---

## 📄 License

This project was created for educational purposes as part of **ITEC 60 - Integrated Programming and Technologies 1**.

© 2026 Cartly — Barias, Joseph L. & Garces, Jonas. All rights reserved.
