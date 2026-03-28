# Elegance EMS - Frontend

<div align="center">

**React-based frontend for the Elegance Employee Management System**

[![React](https://img.shields.io/badge/React-18.3-blue?style=for-the-badge&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)
[![Node.js](https://img.shields.io/badge/Node.js-22-green?style=for-the-badge&logo=nodedotjs)](https://nodejs.org)

</div>

---

## Overview

The frontend is built with React 18 and Vite, featuring a modern dark-themed UI with:

- ⚡ **Lightning Fast** — Vite for instant HMR and optimized builds
- 🎨 **Beautiful UI** — Tailwind CSS with custom design system
- 📊 **Interactive Charts** — Recharts for data visualization
- 💬 **Real-time Updates** — Socket.io integration
- 📱 **Fully Responsive** — Mobile-first design

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Environment Variables

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:3000
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run tests |
| `npm run test:run` | Run tests once |

---

## Project Structure

```
src/
├── 📂 components/          # Reusable UI components
│   ├── DashboardLayout.jsx
│   ├── DashboardHome.jsx
│   ├── EmployeesList.jsx
│   ├── AttendanceList.jsx
│   ├── LeavesList.jsx
│   ├── ChatWindow.jsx
│   ├── Skeleton.jsx       # Loading states
│   ├── Loader.jsx         # Cinematic loader
│   └── 📂 skeletons/      # Page-specific skeletons
│
├── 📂 pages/             # Route pages
│   ├── Login.jsx
│   ├── AdminDashboard.jsx
│   ├── EmployeeDashboard.jsx
│   └── RootDashboard.jsx
│
├── 📂 context/           # React context
│   └── authContext.jsx
│
├── 📂 config/           # Configuration
│   └── api.js
│
├── 📂 assets/           # Static assets
│   └── Logo/
│
├── App.jsx              # Root component
├── main.jsx            # Entry point
└── index.css          # Global styles
```

---

## Features

### Pages

| Page | Description |
|------|-------------|
| Login | JWT authentication with password strength indicator |
| Admin Dashboard | Full system overview with charts and statistics |
| Employee Dashboard | Personal attendance, leaves, and notifications |
| Root Dashboard | System-wide management with all admin features |

### Components

| Component | Description |
|-----------|-------------|
| DashboardLayout | Main layout with sidebar, header, footer |
| EmployeesList | Paginated employee table with search/filter |
| AttendanceList | Attendance records with calendar view |
| LeavesList | Leave requests with approve/reject actions |
| ChatWindow | WhatsApp-style messaging interface |
| LeaveCalendar | Visual leave and holiday calendar |
| Notifications | Real-time notification bell |
| ActivityLog | Audit trail viewer |

### Design System

- **Dark Theme** — Sleek modern dark UI
- **Custom Colors** — CSS variables for theming
- **Animations** — Smooth transitions and micro-interactions
- **Icons** — Lucide React icon library

---

## Performance

- **Code Splitting** — Lazy loading with React.lazy()
- **Skeleton Loading** — Beautiful loading states
- **Optimized Bundles** — Separate vendor chunks
- **Tree Shaking** — Unused code eliminated

---

## Scripts Reference

See [package.json](package.json) for all available scripts.

---

<div align="center">

**Built with ❤️ — Part of the Elegance EMS project**

</div>
