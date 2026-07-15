# 🛕 DarshanEase — Temple Darshan Booking Platform (MERN Stack)

DarshanEase is a full-stack MERN application that lets users explore temples,
view live darshan slot availability, book tickets, manage bookings, and make
donations — with secure JWT authentication and role-based access
(USER / ADMIN / ORGANIZER).

---

## ⚡ Quick Setup (One Command)

Instead of running each step manually, use the included setup script:

**macOS / Linux:**
```bash
cd darshanease
chmod +x setup.sh
./setup.sh
```

**Windows:**
```
Double-click setup.bat
(or run it from Command Prompt: setup.bat)
```

The script installs backend & frontend dependencies, creates `.env` files
from the examples, seeds the database with sample temples/slots/admin,
and starts both the backend (port 5000) and frontend (port 3000).
You still need MongoDB installed/running (or an Atlas URI in `backend/.env`)
before the script reaches the seeding step — it will pause and remind you.

If you prefer full manual control, follow the step-by-step instructions below.

---

## 📁 Project Structure

```
darshanease/
├── backend/                 # Express + MongoDB REST API
│   ├── config/db.js
│   ├── models/               # User, Temple, DarshanSlot, Booking, Donation
│   ├── middleware/           # auth (JWT), role (RBAC), errorHandler
│   ├── controllers/          # business logic for each module
│   ├── routes/               # API route definitions
│   ├── seed/seedTemples.js   # sample data seeder (temples + slots + admin)
│   ├── server.js             # app entry point
│   ├── package.json
│   └── .env.example
│
└── frontend/                 # React + Bootstrap client
    ├── public/index.html
    ├── src/
    │   ├── api/axios.js       # pre-configured axios instance (JWT interceptor)
    │   ├── context/AuthContext.js
    │   ├── components/        # Navbar, Footer, TempleCard, SlotModal, PrivateRoute
    │   ├── pages/              # Home, Login, Register, Temples, TempleDetail,
    │   │                        MyBookings, Donations, AdminDashboard, AdminAddTemple
    │   ├── App.js / App.css / index.js / index.css
    ├── package.json
    └── .env.example
```

---

## ✅ Prerequisites

Install these before you start:

| Tool | Version | Check with |
|---|---|---|
| Node.js | v16 or higher | `node -v` |
| npm | comes with Node | `npm -v` |
| MongoDB | Community Server (local) OR a free MongoDB Atlas cluster | `mongod --version` |
| Git (optional) | any recent version | `git --version` |
| Postman (optional) | any recent version | for testing APIs |

If you don't want to install MongoDB locally, create a free cluster at
https://www.mongodb.com/atlas and use its connection string instead.

---

## 🚀 Step-by-Step Setup

### 1. Unzip the project
Extract `darshanease.zip` anywhere on your computer. You'll get a `darshanease/`
folder containing `backend/` and `frontend/`.

### 2. Set up the Backend

```bash
cd darshanease/backend
npm install
```

Create your environment file:

```bash
# Windows (PowerShell)
copy .env.example .env

# macOS / Linux
cp .env.example .env
```

Open `.env` and update the values:

```env
MONGO_URI=mongodb://127.0.0.1:27017/darshanease
JWT_SECRET=darshanease_super_secret_key_change_this
JWT_EXPIRES_IN=7d
PORT=5000
CLIENT_URL=http://localhost:3000
```

> If you're using MongoDB Atlas, replace `MONGO_URI` with your Atlas
> connection string, e.g.
> `mongodb+srv://<user>:<password>@cluster0.mongodb.net/darshanease`

**Start MongoDB** (skip this if using Atlas):

```bash
# macOS / Linux
mongod

# Windows — usually runs as a service automatically after install,
# or run: "C:\Program Files\MongoDB\Server\<version>\bin\mongod.exe"
```

**Seed the database** with sample temples, darshan slots, and an admin account:

```bash
npm run seed
```

This will add:
- 6 sample temples (Tirupati, Meenakshi, Golden Temple, Kashi Vishwanath, Siddhivinayak, Vaishno Devi)
- 5 days of darshan slots per temple (general + VIP)
- An admin login: **admin@darshanease.com / Admin@123**

**Start the backend server:**

```bash
npm run dev        # with auto-reload (nodemon)
# OR
npm start          # plain node
```

The API will run at **http://localhost:5000**. Visit
http://localhost:5000/ in your browser — you should see a JSON success message.

### 3. Set up the Frontend

Open a **new terminal window** (keep the backend running):

```bash
cd darshanease/frontend
npm install
```

Create your environment file:

```bash
copy .env.example .env      # Windows
cp .env.example .env        # macOS / Linux
```

Confirm it points to your backend:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

**Start the React app:**

```bash
npm start
```

The frontend opens automatically at **http://localhost:3000**.

---

## 🔑 Default Login (after seeding)

| Role | Email | Password |
|---|---|---|
| Admin | admin@darshanease.com | Admin@123 |

Regular users can self-register from the **Sign Up** page (defaults to `USER` role).

To create an ORGANIZER account for testing, register normally then update the
role directly in MongoDB (or extend the register form) — for production you'd
typically have an Admin promote users rather than letting anyone self-select
a privileged role.

---

## 🧭 How to Add Temples (Admin)

1. Login with the admin account (or any ADMIN/ORGANIZER user).
2. Click **Admin Panel** in the navbar.
3. Click **+ Add New Temple**.
4. Fill in: Temple Name, Deity, City, State, Address, Description, Image URL,
   Timings, and Facilities (comma separated) → **Add Temple**.
5. Go to the **Add Darshan Slot** tab in the Admin Panel to create bookable
   slots for that temple (date, time, capacity, price, slot type).
6. The new temple + its slots immediately appear on the public **Temples**
   page for users to browse and book.

---

## 🔌 API Overview

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Register new user |
| POST | `/auth/login` | Public | Login, returns JWT |
| GET | `/auth/me` | Private | Get logged-in profile |
| GET | `/temples` | Public | List temples (search, city, pagination) |
| GET | `/temples/:id` | Public | Temple details |
| POST | `/temples` | ADMIN/ORGANIZER | Create temple |
| PUT | `/temples/:id` | ADMIN/ORGANIZER | Update temple |
| DELETE | `/temples/:id` | ADMIN | Delete temple |
| GET | `/slots/temple/:templeId` | Public | Slots for a temple (optional `?date=`) |
| POST | `/slots` | ADMIN/ORGANIZER | Create darshan slot |
| PUT | `/slots/:id` | ADMIN/ORGANIZER | Update slot |
| DELETE | `/slots/:id` | ADMIN/ORGANIZER | Delete slot |
| POST | `/bookings` | Private | Book a darshan slot |
| GET | `/bookings/my` | Private | My bookings |
| GET | `/bookings` | ADMIN/ORGANIZER | All bookings |
| PUT | `/bookings/:id/cancel` | Owner/ADMIN | Cancel a booking |
| POST | `/donations` | Private | Make a donation |
| GET | `/donations/my` | Private | My donations |
| GET | `/donations` | ADMIN/ORGANIZER | All donations |

Import these into **Postman** for manual testing — remember to add
`Authorization: Bearer <token>` header for private routes (token returned
from login/register).

---

## 🛡️ Security Features

- Passwords hashed with **bcrypt.js** before storage.
- **JWT** issued on login/register, verified on every protected route.
- **Role-based middleware** (`authorize("ADMIN", "ORGANIZER")`) restricts
  sensitive routes (temple/slot management, viewing all bookings/donations).
- Centralized **error handling** middleware normalizes Mongoose validation,
  cast, and duplicate-key errors into clean JSON responses.
- CORS locked to the configured `CLIENT_URL`.

---

## 🎨 Frontend Highlights

- Fully responsive **Bootstrap 5** layout with a custom saffron/maroon temple
  theme (see `src/App.css`).
- **React Context (`AuthContext`)** for global auth state, no prop drilling.
- **Axios instance** with request/response interceptors — auto-attaches JWT,
  auto-logs-out on token expiry.
- **React Router v6** protected routes (`PrivateRoute`, `RoleRoute`) for
  logged-in-only and admin-only pages.
- **React Toastify** for consistent success/error notifications.
- Booking modal with live available-ticket count and total price calculation.

---

## 🧪 Testing Checklist

- [ ] Register a new user → login → check profile via `/auth/me`
- [ ] Browse temples, search by name/city
- [ ] Open a temple, filter slots by date, book a slot, check ticket count decreases
- [ ] View booking in **My Bookings**, cancel it, confirm slot capacity is released
- [ ] Make a donation, confirm it appears in donation history
- [ ] Login as admin, add a temple, add a slot, verify it appears publicly
- [ ] Try accessing `/admin` as a normal `USER` → should redirect to Home
- [ ] Try calling admin-only API routes without a token → should return 401/403

---

## 🛠️ Troubleshooting

| Problem | Fix |
|---|---|
| `MongoDB Connection Error` | Ensure `mongod` is running, or check your Atlas URI/whitelist |
| CORS errors in browser console | Confirm `CLIENT_URL` in backend `.env` matches your frontend URL |
| `401 Not authorized` on every request | Token expired/missing — logout & login again |
| Frontend can't reach backend | Confirm `REACT_APP_API_URL` in frontend `.env` and that backend is running on port 5000 |
| Port already in use | Change `PORT` in backend `.env`, or stop the conflicting process |

---

## 📦 Production Build (optional)

```bash
cd frontend
npm run build
```

This creates an optimized `build/` folder you can serve via any static host
(Netlify, Vercel, Nginx, or Express's `express.static`).

---

Built with ❤️ using MongoDB, Express.js, React.js, and Node.js.
