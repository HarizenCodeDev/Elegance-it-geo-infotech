# 🎯 Elegance EMS

<div align="center">

[![Elegance Logo](Frontend/src/assets/Logo/EG.png)](#)

### Enterprise Employee Management System

[![React](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-22-green?style=flat&logo=nodedotjs)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-5-lightgrey?style=flat&logo=express)](https://expressjs.com)
[![PostgreSQL](https://img.shields.io/badge/Supabase-PostgreSQL-blueviolet?style=flat&logo=postgresql)](https://supabase.com)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=flat&logo=vercel)](https://vercel.com)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat)](LICENSE)

**A modern, secure, and scalable employee management system.**

[Live Demo](#) • [Features](#features) • [Tech Stack](#tech-stack) • [Getting Started](#getting-started)

</div>

---

## 🚀 Live Production

| Service | URL |
|---------|-----|
| **Frontend** | [elegance-ems-haridevx.vercel.app](https://elegance-ems-haridevx.vercel.app) |
| **Backend API** | [haridevx-eg-server.onrender.com](https://haridevx-eg-server.onrender.com) |

### Default Login
- **Email**: `rootharidevx@elegance.com`
- **Password**: `Rootadmmin@$123`

---

<img width="1922" height="959" alt="it" src="https://github.com/user-attachments/assets/3555eb5c-d686-496e-8204-b28c2d30d165" />
---
<img width="3444" height="3516" alt="diagram" src="https://github.com/user-attachments/assets/25d4eae6-68e8-4229-94f8-aec8bd878a0a" />

## ✨ Features

### 🔐 Authentication & Security
- JWT-based authentication with refresh tokens (JWT_SECRET env var required)
- Password complexity enforcement (8+ chars, uppercase, lowercase, numbers, special)
- Password expiry after 90 days
- Account lockout after 5 failed attempts (15-minute lockout)
- Session management across devices
- Remember Me with extended 30-day sessions
- Role hierarchy enforcement — users cannot manage others with equal/higher role
- Input sanitization skips password fields to preserve special characters

### 👥 Employee Management
- Complete CRUD operations
- Search & filter by department, role, status
- Export to Excel with one click
- Profile management with avatar upload

### 📊 Attendance Tracking
- Auto check-in/check-out
- Manual entry support
- Calendar view with status tracking
- Real-time attendance dashboard

### 📝 Leave Management
- Leave request & approval workflow
- Balance tracking by leave type
- Overlap prevention
- Leave predictions & forecasting

### 💰 Payroll & Salary
- Payroll processing with allowances & deductions
- Net pay calculation
- Monthly salary slip generation
- Download tracking

### 📋 HR Workflows
- Resignation submission & approval workflow
- Onboarding task management with progress tracking
- Checklist system for new hires
- Email notifications for status changes

### 📍 Advanced Attendance
- QR code-based check-in (time-limited tokens)
- Geolocation-based check-in with office radius enforcement
- Real-time attendance dashboard with late detection

### 💬 Internal Communication
- Direct messaging
- Group chats
- Real-time updates with Socket.io
- Emoji support

### 📢 Additional Features
- Company announcements with priority levels
- Holiday management
- Activity logs & audit trail
- In-app notifications
- Dark-themed UI
- Excel export
- Responsive design

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 19 | UI Library |
| Vite 8 | Build Tool |
| Tailwind CSS 3.4 | Styling |
| React Router 7 | Routing |
| Recharts | Charts |
| Axios | HTTP Client |
| Framer Motion | Animations |
| Vitest | Unit Testing |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js 22 | Runtime |
| Express 5 | Framework |
| Knex.js 3 | Query Builder |
| PostgreSQL (Supabase) | Database |
| JWT | Authentication |
| Bcryptjs | Password Hashing |
| Socket.io | Real-time |
| Vitest | Unit Testing |

### Deployment
| Service | Purpose |
|---------|---------|
| Vercel | Frontend Hosting |
| Render | Backend API |
| Supabase | PostgreSQL Database |

---

## 🏁 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- **PostgreSQL** (local or Docker) — SQLite is not compatible (UUID schema)

### Local Development

```bash
# Clone the repository
git clone https://github.com/HariDevex/Elegance-IT-Geo-Infotech.git
cd Elegance-IT-Geo-Infotech

# Start PostgreSQL via Docker (optional but recommended)
docker run -d --name elegance-pg -e POSTGRES_USER=elegance \
  -e POSTGRES_PASSWORD=elegance -e POSTGRES_DB=elegance_ems \
  -p 5432:5432 postgres:16

# Backend Setup
cd server
npm install
cp .env.example .env  # Set DATABASE_URL=postgresql://elegance:elegance@localhost:5432/elegance_ems
npm run db:migrate
node seeds/seed.js     # Run seed directly (not via knex)
npm run dev            # Uses node --watch, starts on :3000

# Frontend Setup (new terminal)
cd ../Frontend
npm install
npm run dev            # Vite dev server on :8081, proxies /api to :3000
```

### Access Locally
- **Frontend**: http://localhost:8081
- **Backend API**: http://localhost:3000/api

### Default Login (Local Seed)
- **Employee ID**: `EJB2026266` (randomly generated, check seed output)
- **Password**: `admin123`

### Troubleshooting

| Issue | Solution |
|---|---|
| `relation "users" does not exist` | Run `npm run db:migrate` before seeding |
| `null value in column "id"` | Ensure PostgreSQL is used (not SQLite) |
| Foreign key constraint errors | Ensure users are seeded before dependent tables |
| Seed doesn't create user | Seed checks for existing root user; truncate `users` table to re-run |
| Frontend can't reach API | Vite proxy forwards `/api` to `:3000`; ensure backend is running |
| Port conflicts | Backend uses `:3000`, frontend uses `:8081` |

---

## 📁 Project Structure

```
Elegance-IT-Geo-Infotech/
├── server/                 # Express.js backend
│   ├── config/            # Database configuration
│   ├── controller/        # Business logic (incl. exportController)
│   ├── middleware/        # Auth, validation, errors
│   ├── migrations/        # Database schema
│   ├── routes/           # API endpoints
│   ├── seeds/            # Initial data
│   ├── tests/            # Unit tests (60+ tests)
│   ├── utils/            # Helpers (caching, logging)
│   └── index.js          # Entry point
│
├── Frontend/              # React frontend
│   ├── src/
│   │   ├── components/   # Reusable UI (incl. PayrollManagement, SalarySlips, OnboardingSystem, ResignationWorkflow)
│   │   ├── hooks/        # Custom React hooks
│   │   ├── services/     # API service layer
│   │   ├── pages/        # Route pages
│   │   ├── context/      # React context (auth)
│   │   └── assets/       # Static assets
│   └── index.html
│
├── types/                 # TypeScript type definitions (.d.ts)
├── docs/                  # Architecture & API documentation
├── vercel.json           # Vercel config
└── README.md
```

---

## 🌐 API Endpoints

| Module | Endpoint | Methods |
|--------|----------|---------|
| Auth | `/api/auth/*` | login, logout, profile, change-password, sessions |
| Employees | `/api/employees` | CRUD operations |
| Attendance | `/api/attendance` | CRUD, check-in/out |
| My Attendance | `/api/attendance/my` | GET (self-service) |
| Leaves | `/api/leaves` | CRUD, approve/reject |
| Leave Balance | `/api/leave-balance/*` | get/set balances, types |
| Chat | `/api/chat` | messages, groups |
| Notifications | `/api/notifications` | CRUD |
| Holidays | `/api/holidays` | CRUD |
| Activity Logs | `/api/activity-logs` | GET |
| AI Features | `/api/ai/*` | insights, search, chat |
| Payroll | `/api/payroll` | CRUD, process |
| Salary Slips | `/api/salary-slips` | generate, list, download |
| Resignations | `/api/resignations` | submit, list, approve/reject |
| Onboarding | `/api/onboarding/*` | tasks, checklist |
| Export Employees | `/api/auth/export/employees` | GET |
| Export Attendance | `/api/auth/export/attendance` | GET |
| Export Login Logs | `/api/auth/export/login-logs` | GET |
| QR Check-in | `/api/attendance/generate-qr` | POST (generate QR token) |
| QR Check-in | `/api/attendance/qr-checkin` | POST (scan & check in) |
| Geo Check-in | `/api/attendance/geo-checkin` | POST (location-based) |

---

## 📝 License

MIT License - see [LICENSE](LICENSE) file.

---

<div align="center">

**© 2026 Elegance IT & Geo Synergy. All rights reserved.**

Built with ❤️ by [HariDevex](https://github.com/HariDevex)

</div>
