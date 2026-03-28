# QA Testing Plan - Elegance EMS

## Overview
This document outlines the comprehensive QA testing plan for the Elegance Employee Management System (EMS).

## Test Environment Setup

### Prerequisites
1. Frontend: http://192.168.29.205 (port 80) or http://192.168.29.205:8080 (direct)
2. Backend API: http://192.168.29.205:5000 or http://192.168.29.205/api
3. Test Accounts:
   - Root: mrnobody@elegance.com / mrnobody009
   - Admin: admin@elegance.com / admin123
   - Manager: manager@elegance.com / manager123
   - Developer: sathis@example.com / developer123

### Test Data Setup
```sql
-- Create test employees
INSERT INTO users (name, email, password, role, department, branch, created_at) 
VALUES ('Test Admin', 'testadmin@elegance.com', '$2b$10$...', 'admin', 'Administration', 'bengaluru', NOW());

INSERT INTO users (name, email, password, role, department, branch, created_at) 
VALUES ('Test Manager', 'testmanager@elegance.com', '$2b$10$...', 'manager', 'Development', 'bengaluru', NOW());

INSERT INTO users (name, email, password, role, department, branch, created_at) 
VALUES ('Test Developer', 'testdev@elegance.com', '$2b$10$...', 'developer', 'Development', 'bengaluru', NOW());

INSERT INTO users (name, email, password, role, department, branch, created_at) 
VALUES ('Test HR', 'testhr@elegance.com', '$2b$10$...', 'hr', 'HR', 'bengaluru', NOW());
```

---

## Test Cases

### 1. Authentication Module

| TC ID | Test Case | Steps | Expected Result | Priority |
|-------|-----------|-------|-----------------|----------|
| AUTH-01 | Login with valid credentials | 1. Go to login page<br>2. Enter valid email/password<br>3. Click Login | User redirected to dashboard | P0 |
| AUTH-02 | Login with invalid credentials | 1. Go to login page<br>2. Enter invalid email/password<br>3. Click Login | Error message displayed | P0 |
| AUTH-03 | Login with empty fields | 1. Go to login page<br>2. Leave fields empty<br>3. Click Login | Validation error displayed | P1 |
| AUTH-04 | Logout functionality | 1. Login<br>2. Click logout | User redirected to login, session cleared | P0 |
| AUTH-05 | Forgot password | 1. Click forgot password<br>2. Enter valid email<br>3. Submit | Success message, email sent | P1 |
| AUTH-06 | Password reset | 1. Use reset link<br>2. Set new password<br>3. Submit | Password updated, redirect to login | P1 |
| AUTH-07 | Session management | 1. Login from multiple devices<br>2. View sessions<br>3. Terminate one session | Session terminated | P1 |
| AUTH-08 | Rate limiting | 1. Attempt 20+ failed logins | Account temporarily locked | P2 |

### 2. Employee Management Module

| TC ID | Test Case | Steps | Expected Result | Priority |
|-------|-----------|-------|-----------------|----------|
| EMP-01 | Add new employee | 1. Navigate to Add Employee<br>2. Fill all required fields<br>3. Upload profile image<br>4. Submit | Employee created, success message | P0 |
| EMP-02 | Add employee with duplicate email | 1. Navigate to Add Employee<br>2. Enter existing email<br>3. Submit | Error: Email already exists | P0 |
| EMP-03 | Add employee with invalid data | 1. Leave required fields empty<br>2. Submit | Validation errors displayed | P1 |
| EMP-04 | Edit employee | 1. Select employee<br>2. Edit fields<br>3. Save | Changes saved successfully | P0 |
| EMP-05 | Delete employee | 1. Select employee<br>2. Click delete<br>3. Confirm | Employee removed from system | P0 |
| EMP-06 | View employee list | 1. Navigate to employees list<br>2. Verify pagination | All employees displayed | P1 |
| EMP-07 | Search employees | 1. Enter search term<br>2. Verify results | Matching employees shown | P1 |
| EMP-08 | Filter employees by role | 1. Select role filter<br>2. Verify results | Filtered list displayed | P2 |

### 3. Leave Management Module

| TC ID | Test Case | Steps | Expected Result | Priority |
|-------|-----------|-------|-----------------|----------|
| LEAVE-01 | Apply for leave | 1. Navigate to leave request<br>2. Select leave type<br>3. Set dates<br>4. Submit | Leave request created | P0 |
| LEAVE-02 | Apply with invalid dates | 1. Set "To" date before "From" date<br>2. Submit | Validation error displayed | P0 |
| LEAVE-03 | View leave balance | 1. Navigate to leave balance<br>2. Verify display | All leave types with balances shown | P0 |
| LEAVE-04 | Approve leave request | 1. Login as admin<br>2. Navigate to leaves<br>3. Approve pending request | Leave approved, balance updated | P0 |
| LEAVE-05 | Reject leave request | 1. Login as admin<br>2. Navigate to leaves<br>3. Reject request | Leave rejected, no balance change | P1 |
| LEAVE-06 | Cancel own leave | 1. Submit leave request<br>2. Cancel before approval | Leave deleted | P1 |
| LEAVE-07 | Leave balance calculation | 1. Approve 3-day leave<br>2. Verify balance | Balance reduced by 3 | P0 |
| LEAVE-08 | Leave types validation | 1. Try invalid leave type<br>2. Submit | Error: Invalid leave type | P0 |

### 4. Attendance/Check-In Module

| TC ID | Test Case | Steps | Expected Result | Priority |
|-------|-----------|-------|-----------------|----------|
| ATT-01 | Check-in | 1. Click Check In button | Success message, record created | P0 |
| ATT-02 | Check-out | 1. Click Check Out button | Success with duration shown | P0 |
| ATT-03 | Multiple check-ins | 1. Check in 4 times | Error: Max 3 per day | P0 |
| ATT-04 | Check-out without check-in | 1. Try to check out first | Error: No check-in found | P0 |
| ATT-05 | View check-in records | 1. Navigate to records | All sessions displayed | P1 |
| ATT-06 | Late check-in detection | 1. Check in after 9:15 AM | Status marked as "Late" | P1 |
| ATT-07 | Export attendance | 1. Click Export<br>2. Download file | Excel file downloaded | P2 |

### 5. Holiday Management Module

| TC ID | Test Case | Steps | Expected Result | Priority |
|-------|-----------|-------|-----------------|----------|
| HOL-01 | Add holiday | 1. Navigate to holidays<br>2. Click Add Holiday<br>3. Fill form<br>4. Submit | Holiday created | P0 |
| HOL-02 | Auto-populate holidays | 1. Click Auto Populate<br>2. Select years | Sundays + public holidays added | P1 |
| HOL-03 | Delete holiday | 1. Click delete on holiday<br>2. Confirm | Holiday removed | P1 |
| HOL-04 | View calendar | 1. Navigate to calendar<br>2. Verify holidays | Holidays displayed on dates | P2 |

### 6. Announcement Module

| TC ID | Test Case | Steps | Expected Result | Priority |
|-------|-----------|-------|-----------------|----------|
| ANN-01 | Create announcement | 1. Navigate to announcements<br>2. Create new<br>3. Set audience<br>4. Submit | Announcement posted | P0 |
| ANN-02 | View announcements | 1. Login as employee<br>2. View dashboard | Relevant announcements shown | P1 |
| ANN-03 | Delete announcement | 1. Delete own announcement<br>2. Try delete others | Only own deleted | P1 |

### 7. Profile Management Module

| TC ID | Test Case | Steps | Expected Result | Priority |
|-------|-----------|-------|-----------------|----------|
| PROF-01 | Update profile | 1. Navigate to profile<br>2. Edit fields<br>3. Save | Changes saved | P1 |
| PROF-02 | Change password | 1. Go to change password<br>2. Enter old/new password<br>3. Submit | Password changed | P1 |
| PROF-03 | Upload profile image | 1. Navigate to profile<br>2. Upload image<br>3. Save | Image displayed | P1 |

### 8. Dashboard & UI Module

| TC ID | Test Case | Steps | Expected Result | Priority |
|-------|-----------|-------|-----------------|----------|
| UI-01 | Responsive design | 1. Test on mobile/tablet<br>2. Resize browser | UI adapts properly | P1 |
| UI-02 | Navigation menu | 1. Test all menu items<br>2. Verify access control | Correct pages for role | P1 |
| UI-03 | Notifications | 1. Create leave request<br>2. Approve as admin<br>3. Check notifications | Notification shown | P2 |
| UI-04 | Loading states | 1. Perform actions<br>2. Observe loading | Skeleton loaders shown | P2 |

---

## API Endpoint Testing

### Authentication APIs
```
POST /api/auth/login        - Login
POST /api/auth/logout       - Logout
POST /api/auth/forgot-password - Forgot password
POST /api/auth/reset-password  - Reset password
GET  /api/auth/me           - Get current user
```

### Employee APIs
```
POST   /api/employees        - Create employee
GET    /api/employees        - List employees
GET    /api/employees/:id    - Get employee
PUT    /api/employees/:id    - Update employee
DELETE /api/employees/:id    - Delete employee
```

### Leave APIs
```
POST   /api/leaves           - Create leave request
GET    /api/leaves           - List leaves
PUT    /api/leaves/:id       - Update leave status
DELETE /api/leaves/:id       - Delete leave
GET    /api/leave-balance/balance - Get leave balance
```

### Attendance APIs
```
POST   /api/checkin/checkin  - Check in
POST   /api/checkin/checkout - Check out
GET    /api/checkin/my-records - Get my records
GET    /api/attendance/my    - Get my attendance
GET    /api/attendance       - List all attendance (admin)
```

### Other APIs
```
GET    /api/holidays         - List holidays
POST   /api/holidays         - Create holiday
DELETE /api/holidays/:id     - Delete holiday
GET    /api/announcements    - List announcements
POST   /api/announcements    - Create announcement
GET    /api/notifications     - List notifications
GET    /api/activity-logs    - List activity logs
```

---

## Bug Severity Classification

### Critical (P0)
- Security vulnerabilities
- Data loss or corruption
- Authentication failures
- Core functionality not working
- API returns 500 errors

### High (P1)
- Major features not working
- Data inconsistency
- UI/UX blocking issues
- Performance degradation

### Medium (P2)
- Minor UI issues
- Non-blocking errors
- Edge case handling

### Low (P3)
- Cosmetic issues
- Documentation errors
- Minor UI glitches

---

## Bug Report Template

```markdown
## Bug Report: [Title]

**Bug ID:** BUG-[NUMBER]
**Severity:** [Critical/High/Medium/Low]
**Component:** [Module Name]
**Reported By:** [Name]
**Date:** [Date]

### Description
[Detailed description of the bug]

### Steps to Reproduce
1. [Step 1]
2. [Step 2]
3. [Step 3]

### Expected Behavior
[What should happen]

### Actual Behavior
[What actually happens]

### Environment
- Browser: [Browser name and version]
- OS: [Operating system]
- URL: [Application URL]

### Screenshots
[Attach screenshots if applicable]

### Logs/Error Messages
```
[Error message or stack trace]
```

### Priority
[P0/P1/P2/P3]

### Status
[Open/In Progress/Resolved/Closed]
```

---

## Test Execution Checklist

### Pre-Deployment Testing
- [ ] All P0 test cases passed
- [ ] All P1 test cases passed
- [ ] No critical security issues
- [ ] API endpoints return correct status codes
- [ ] Database integrity maintained

### Post-Deployment Testing
- [ ] Smoke tests on production
- [ ] User acceptance testing
- [ ] Performance testing
- [ ] Security audit

---

## Known Issues

| Issue ID | Description | Severity | Status | Workaround |
|----------|------------|----------|--------|------------|
| KNOWN-01 | Check-in max 3 per day enforced | N/A | By Design | Wait for next day |
| KNOWN-02 | Profile image upload requires small file | Medium | Known | Compress images |
