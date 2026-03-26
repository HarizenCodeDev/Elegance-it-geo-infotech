# 🎯 Elegance IT & Geo Synergy - Employee Management System

<p align="center">
  <img src="Frontend/src/assets/Logo/EG.png" alt="Elegance Logo" width="120" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.2-blue?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/Node.js-22-green?style=for-the-badge&logo=nodedotjs" alt="Node.js">
  <img src="https://img.shields.io/badge/Express-4.x-lightgrey?style=for-the-badge&logo=express" alt="Express">
  <img src="https://img.shields.io/badge/SQLite-3-orange?style=for-the-badge&logo=sqlite" alt="SQLite">
  <img src="https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwindcss" alt="Tailwind">
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" alt="License">
</p>

---

## 🚀 Overview

**Elegance EMS** is a comprehensive, full-stack Employee Management System designed for modern organizations. Built with a sleek dark-themed UI, it provides complete control over employee data, attendance tracking, leave management, and internal communications.

### ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🔐 **Secure Authentication** | JWT-based login with bcrypt password hashing |
| 👥 **Role-Based Access** | 6 roles: Root, Admin, Manager, Team Lead, HR, Developer |
| 📊 **Interactive Dashboard** | Real-time statistics with beautiful charts |
| 📋 **Employee Management** | Complete CRUD operations with profile management |
| ✅ **Attendance Tracking** | Daily check-in/check-out with status management |
| 🏖️ **Leave Management** | Request, approve, reject with balance tracking |
| 📢 **Announcements** | Company-wide announcements and updates |
| 💬 **Internal Chat** | Direct and group messaging system |
| 🎉 **Celebrations** | Birthday and work anniversary alerts |
| 📅 **Holiday Calendar** | Track company holidays and events |
| 📝 **Activity Logs** | Complete audit trail of all actions |
| 🔔 **Notifications** | Real-time in-app notifications |
| 📱 **Responsive Design** | Works on desktop, tablet, and mobile |

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Lightning-fast build tool
- **Tailwind CSS 3.4** - Utility-first styling
- **Recharts** - Beautiful charts
- **Lucide React** - Icon library
- **React Router 6** - Client-side routing
- **Axios** - HTTP client

### Backend
- **Node.js 22** - JavaScript runtime
- **Express 4** - Web framework
- **Knex.js** - SQL query builder
- **Better-SQLite3** - SQLite for development
- **JWT** - Token-based auth
- **Bcrypt** - Password hashing
- **Multer** - File uploads

---

## 📦 Installation

### Prerequisites

- **Node.js 18+** ([Download](https://nodejs.org/))
- **npm** or **yarn**

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/HarizenCodeDev/Elegance-it-geo-infotech.git
cd Elegance-it-geo-infotech

# 2. Backend Setup
cd server
npm install

# 3. Frontend Setup (new terminal)
cd ../Frontend
npm install

# 4. Start Backend
cd server
npm start

# 5. Start Frontend (new terminal)
cd Frontend
npm run dev
```

### Access the Application

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:3000/api](http://localhost:3000/api)

---

## 📁 Project Structure

```
Elegance/
├── 📂 server/
│   ├── 📂 config/
│   │   └── database.js          # Database configuration
│   ├── 📂 controller/
│   │   ├── authController.js     # Authentication logic
│   │   ├── employeeController.js  # Employee CRUD
│   │   ├── attendanceController.js
│   │   ├── leaveController.js
│   │   ├── chatController.js
│   │   ├── announcementController.js
│   │   ├── notificationController.js
│   │   ├── holidayController.js
│   │   ├── leaveBalanceController.js
│   │   ├── activityLogController.js
│   │   └── documentController.js
│   ├── 📂 middleware/
│   │   └── errorHandler.js       # Error logging
│   ├── 📂 migrations/             # Database schema
│   ├── 📂 routes/                 # API routes
│   ├── 📂 seeds/                  # Initial data
│   ├── 📂 uploads/                # Uploaded files
│   ├── 📂 data/                  # SQLite database
│   ├── 📂 logs/                  # Server logs
│   ├── index.js                   # Entry point
│   ├── knexfile.js              # Knex configuration
│   ├── package.json
│   └── .env                      # Environment variables
│
└── 📂 Frontend/
    ├── 📂 src/
    │   ├── 📂 components/
    │   │   ├── DashboardLayout.jsx
    │   │   ├── DashboardHome.jsx
    │   │   ├── EmployeeHome.jsx
    │   │   ├── EmployeesList.jsx
    │   │   ├── AttendanceList.jsx
    │   │   ├── LeavesList.jsx
    │   │   ├── ChatWindow.jsx
    │   │   ├── NotificationBell.jsx
    │   │   ├── LeaveBalance.jsx
    │   │   ├── LeaveCalendar.jsx
    │   │   ├── Celebrations.jsx
    │   │   ├── HolidayManagement.jsx
    │   │   ├── ActivityLog.jsx
    │   │   ├── Skeleton.jsx
    │   │   ├── VideoBackground.jsx
    │   │   └── 📂 charts/        # Chart components
    │   ├── 📂 pages/
    │   │   ├── Login.jsx
    │   │   ├── AdminDashboard.jsx
    │   │   ├── EmployeeDashboard.jsx
    │   │   ├── RootDashboard.jsx
    │   │   └── ChangePassword.jsx
    │   ├── 📂 context/
    │   │   └── authContext.jsx
    │   ├── 📂 utils/
    │   │   └── excel.jsx          # Export utilities
    │   ├── 📂 assets/
    │   │   └── Logo/
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── .env
```

---

## 🔗 API Endpoints

### 🔐 Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/refresh` | Refresh token |
| PUT | `/api/auth/change-password` | Change password |
| GET | `/api/auth/profile` | Get profile |
| POST | `/api/auth/avatar` | Upload avatar |

### 👥 Employees
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employees` | List employees |
| POST | `/api/employees` | Create employee |
| PUT | `/api/employees/:id` | Update employee |
| DELETE | `/api/employees/:id` | Delete employee |

### ✅ Attendance
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/attendance` | List attendance |
| POST | `/api/attendance` | Mark attendance |
| POST | `/api/checkin/check-in` | Check in |
| POST | `/api/checkin/check-out` | Check out |

### 🏖️ Leaves
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/leaves` | List leaves |
| POST | `/api/leaves` | Create leave |
| PUT | `/api/leaves/:id/status` | Approve/Reject |
| GET | `/api/leave-balance/balance` | Get balance |

### 📢 Announcements
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/announcements` | List announcements |
| POST | `/api/announcements` | Create announcement |
| DELETE | `/api/announcements/:id` | Delete announcement |

### 💬 Chat
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/chat/groups` | List groups |
| GET | `/api/chat/:groupId` | Get messages |
| POST | `/api/chat` | Send message |

### 🔔 Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | List notifications |
| PUT | `/api/notifications/:id/read` | Mark as read |
| PUT | `/api/notifications/read-all` | Mark all as read |

### 📅 Holidays
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/holidays` | List holidays |
| POST | `/api/holidays` | Create holiday |
| DELETE | `/api/holidays/:id` | Delete holiday |

### 📝 Activity Logs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/activity-logs` | List activity logs |

---

## 👥 Role Permissions

| Feature | Root | Admin | Manager | Team Lead | HR | Developer |
|---------|:----:|:-----:|:-------:|:---------:|:--:|:---------:|
| Full Dashboard | ✅ | ✅ | ✅ | ⚠️ | ⚠️ | ⚠️ |
| Manage Employees | ✅ | ✅ | ⚠️ | 👁️ | ✅ | 👁️ |
| Mark Attendance | ✅ | ✅ | ✅ | ⚠️ | ⚠️ | ⚠️ |
| Approve Leaves | ✅ | ✅ | ✅ | ⚠️ | ⚠️ | ❌ |
| Manage Holidays | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| View Activity Logs | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| Manage Announcements | ✅ | ✅ | ✅ | ⚠️ | ✅ | ❌ |
| Chat | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

> ✅ Full Access | ⚠️ Limited | 👁️ View Only | ❌ No Access

---

## ⚙️ Environment Configuration

### Server (.env)

```env
# Server Configuration
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Database (Development - SQLite)
DB_TYPE=sqlite

# Database (Production - PostgreSQL)
# DB_URL=postgresql://user:pass@host:5432/dbname

# JWT Configuration
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_EXPIRES_IN=7d

# Default Admin User
DEFAULT_EMAIL=admin@elegance.com
DEFAULT_PASSWORD=admin123
DEFAULT_NAME=Mr.Nobody
```

### Frontend (.env)

```env
VITE_API_BASE_URL=http://localhost:3000
```

---

## 🎨 Dashboard Features

### Admin Dashboard
- 📊 Total employees, present/absent counts
- 📈 Employee distribution by role (bar chart)
- 🥧 Attendance pie chart
- 🏖️ Leave balance display
- 📅 Leave calendar with holidays
- 🎉 Upcoming birthdays & anniversaries
- 🔔 Notification bell with unread count

### Employee Dashboard
- 📊 Personal attendance statistics
- 📈 Weekly attendance chart
- 🏖️ Individual leave balance
- 📋 Pending leave requests

---

## 🔧 Troubleshooting

### Database Connection Issues

```bash
# For SQLite (development)
# No additional setup needed!

# For PostgreSQL (production)
# 1. Ensure PostgreSQL is running
# 2. Check DB_URL in .env
# 3. Verify database exists
```

### Port Already in Use

```bash
# Find and kill the process
lsof -i :3000
kill -9 <PID>
```

### CORS Errors

Update `FRONTEND_URL` in server `.env`:
```env
FRONTEND_URL=http://localhost:5173
```

---

## 📈 Performance Optimizations

| Optimization | Description |
|--------------|-------------|
| 🚀 Code Splitting | Lazy loading routes with React.lazy() |
| 📦 Chunking | Separate vendor bundles (React, Charts, Utils) |
| 🎬 Video Lazy Load | Video background loads on demand |
| 📊 Chart Lazy Load | Charts load only when needed |
| 📥 Excel Lazy Load | xlsx library loads only on export |
| ⏳ Skeleton Loading | Beautiful loading states |

---

## 🚀 Production Deployment

### Build Frontend

```bash
cd Frontend
npm run build
# Output in dist/ folder
```

### Deploy with PM2

```bash
cd server
npm install -g pm2
pm2 start index.js --name elegance-server
pm2 save
pm2 startup
```

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

<p align="center">
  <strong>Built with ❤️ by <a href="https://github.com/HarizenCodeDev">HarizenCodeDev</a></strong>
  <br>
  <sub>© 2026 Elegance IT & Geo Synergy. All rights reserved.</sub>
</p>
