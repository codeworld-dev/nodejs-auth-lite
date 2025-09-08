
# Node.js Auth Lite 🔑

Lightweight authentication starter kit built with **Node.js, Express, MongoDB & JWT**.
Ideal for quickly bootstrapping secure backend projects.

---

## ✨ Features (Lite Version)

* 🚀 Node.js + Express backend
* 🗄 MongoDB for data storage
* 🔑 JWT authentication (token-based login)
* 👤 APIs:

  * Register User
  * Login & get JWT token
  * Get User details
  * Edit User profile

---

## ⚙️ Installation

```bash
# Clone the repo
git clone https://github.com/codeworld-dev/nodejs-auth-lite.git
cd nodejs-auth-lite

# Install dependencies
npm install

# Build TypeScript
npm run build

# Run development
npm run dev
```

---

## 🔧 Environment Variables

Create a `.env` file in the project root:

```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/auth-kit
JWT_SECRET=my_super_secret_key
```

👉 Example file is already provided as `.env.example`.

---

## 🚀 Usage

1. Start server:

```bash
npm run dev
```

2. API Endpoints:

* **POST /api/register** → Create user
* **POST /api/login** → Login & receive token
* **GET /api/users** → Get user list (requires token)
* **PUT /api/users/\:id** → Edit user (requires token)

Use `Authorization: Bearer <token>` for protected routes.

---

## 📂 Project Structure

```
src
 ┣ config/        # Config & DB connection
 ┣ middlewares/   # JWT verification
 ┣ models/        # Mongoose schemas
 ┣ services/      # Business logic
 ┣ utils/         # JWT helper
 ┣ app.ts         # Express app
 ┣ index.ts       # Server entry
```

---

## 📜 License

MIT License © 2025

---


