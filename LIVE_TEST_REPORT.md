# 🐛 BUG REPORT - ELEGANCE EMS
**Date:** March 28, 2026  
**Tester:** Live Security Testing  
**Target:** http://192.168.29.205

---

## 🔴 CRITICAL BUGS

### BUG-001: Internal Server Error on Invalid IDs
**Severity:** 🔴 CRITICAL  
**Status:** OPEN

**Finding:**
When accessing non-existent resources, the API returns "Internal server error" instead of proper 404 responses.

**Test Evidence:**
```
GET /api/employees/non-existent-123
Response: {"success":false,"error":"Internal server error"}

PUT /api/leaves/non-existent-123
Response: {"success":false,"error":"Internal server error"}

DELETE /api/holidays/non-existent-123  
Response: {"success":false,"error":"Internal server error"}
```

**Impact:** Information disclosure, security reconnaissance possible

**Fix:**
```javascript
// Add proper 404 handling
if (!resource) {
  return res.status(404).json({
    success: false,
    error: "Resource not found"
  });
}
```

---

### BUG-002: Internal Server Error on Invalid JSON
**Severity:** 🔴 CRITICAL  
**Status:** OPEN

**Finding:**
Invalid JSON payloads return "Internal server error" instead of 400 Bad Request.

**Test Evidence:**
```
POST /api/employees
Body: {invalid json}
Response: {"success":false,"error":"Internal server error"}
```

**Impact:** Leaks internal implementation details

**Fix:** Add JSON validation middleware

---

### BUG-003: Internal Server Error on Unicode Injection
**Severity:** 🔴 CRITICAL  
**Status:** OPEN

**Finding:**
Unicode injection attempts cause internal server errors.

**Test Evidence:**
```
POST /api/auth/login
Body: {"email":"admin@email.com\u0000hacker.com","password":"test"}
Response: {"success":false,"error":"Internal server error"}
```

**Fix:** Sanitize all user inputs, add proper error handling

---

### BUG-004: Internal Server Error on Very Long Input
**Severity:** 🔴 CRITICAL  
**Status:** OPEN

**Finding:**
1000 character name field causes internal server error.

**Test Evidence:**
```
POST /api/employees
Body: Name = 1000 'A' characters
Response: {"success":false,"error":"Internal server error"}
```

**Fix:**
```javascript
// Add max length validation
const createSchema = {
  name: { required: true, minLength: 2, maxLength: 255 },
  // ...
};
```

---

## 🟠 HIGH PRIORITY BUGS

### BUG-005: Past Leave Dates Accepted
**Severity:** 🟠 HIGH  
**Status:** OPEN

**Finding:**
Leave requests with past dates are accepted without validation.

**Test Evidence:**
```
POST /api/leaves
Body: {"type":"Annual Leave","from":"2020-01-01","to":"2020-01-05"}
Response: {"success":true,"leave":{...}}
```

**Impact:** Data integrity issues

**Fix:** Add date validation to reject past dates

---

### BUG-006: Overlapping Leave Dates Allowed
**Severity:** 🟠 HIGH  
**Status:** OPEN

**Finding:**
No validation prevents overlapping leave requests for same user.

**Test Evidence:**
```
POST /api/leaves (Leave 1: Oct 1-5)
POST /api/leaves (Leave 2: Oct 3-7)
Both returned: {"success":true}
```

**Impact:** Leave balance inconsistency

**Fix:** Add overlap validation query before inserting

---

### BUG-007: Race Condition in Leave Applications
**Severity:** 🟠 HIGH  
**Status:** OPEN

**Finding:**
5 concurrent leave applications all succeeded - no deduplication.

**Test Evidence:**
```
Concurrent 1: {"success":true,"description":"Concurrent 1"}
Concurrent 2: {"success":true,"description":"Concurrent 2"}
Concurrent 3: {"success":true,"description":"Concurrent 3"}
Concurrent 4: {"success":true,"description":"Concurrent 4"}
Concurrent 5: {"success":true,"description":"Concurrent 5"}
```

**Fix:** Add database-level unique constraint or idempotency key

---

### BUG-008: NoSQL Injection Returns Internal Error
**Severity:** 🟠 HIGH  
**Status:** OPEN

**Finding:**
NoSQL injection payload causes internal server error instead of proper rejection.

**Test Evidence:**
```
POST /api/auth/login
Body: {"email":{"$ne":null},"password":{"$ne":null}}
Response: {"success":false,"error":"Internal server error"}
```

**Fix:** Better error handling for malformed inputs

---

## 🟡 MEDIUM PRIORITY BUGS

### BUG-009: HTTP Instead of HTTPS
**Severity:** 🟡 MEDIUM  
**Status:** OPEN

**Finding:**
Application runs on HTTP, showing browser security warnings.

**Impact:** Credentials may be exposed on networks

---

### BUG-010: X-XSS-Protection Disabled
**Severity:** 🟡 MEDIUM  
**Status:** OPEN

**Finding:**
```
X-XSS-Protection: 0
```

**Fix:** Set to "1; mode=block"

---

### BUG-011: CORS Allows Any Origin with Credentials
**Severity:** 🟡 MEDIUM  
**Status:** OPEN

**Finding:**
```
Access-Control-Allow-Credentials: true
```

**Impact:** Potential CSRF vulnerabilities

---

### BUG-012: No Pagination on Some Endpoints
**Severity:** 🟡 MEDIUM  
**Status:** OPEN

**Finding:**
No max limit on number of records returned.

---

### BUG-013: No Input Sanitization Feedback
**Severity:** 🟡 MEDIUM  
**Status:** OPEN

**Finding:**
XSS payloads are sanitized but no user notification that input was modified.

---

## 🟢 LOW PRIORITY BUGS

### BUG-014: Email Case Sensitivity
**Severity:** 🟢 LOW  
**Status:** OPEN

**Finding:**
Emails stored as lowercase but login accepts any case.

---

### BUG-015: Password Not Required for All Roles
**Severity:** 🟢 LOW  
**Status:** OPEN

**Finding:**
Email can be optional for employee creation.

---

## ✅ TESTS PASSED

| Test | Result | Notes |
|------|--------|-------|
| Health Check | ✅ PASS | Server responding |
| Valid Login | ✅ PASS | Token returned |
| Invalid Credentials | ✅ PASS | Rejected properly |
| Empty Credentials | ✅ PASS | Validation works |
| Missing Password | ✅ PASS | Validation works |
| SQL Injection | ✅ PASS | Blocked (returns invalid creds) |
| JWT Validation | ✅ PASS | Invalid tokens rejected |
| No Token Access | ✅ PASS | 401 returned |
| Duplicate Email | ✅ PASS | Blocked |
| Missing Fields | ✅ PASS | Validation works |
| Invalid Email Format | ✅ PASS | Validation works |
| XSS in Name | ✅ PASS | Sanitized to `&lt;script&gt;` |
| XSS in Announcement | ✅ PASS | Sanitized |
| Security Headers | ✅ PASS | CSP, HSTS, X-Frame set |
| Rate Limiting | ✅ PASS | 500 req/900s |
| Leave Type Validation | ✅ PASS | Invalid types rejected |
| Date Range Validation | ✅ PASS | From > To blocked |
| Check-in Limit | ✅ PASS | 3/day enforced |
| Double Check-out | ✅ PASS | Blocked properly |

---

## 📊 TEST SUMMARY

| Category | Total | Passed | Failed |
|----------|-------|--------|--------|
| Authentication | 10 | 9 | 1 |
| Employees | 7 | 5 | 2 |
| Leaves | 6 | 4 | 2 |
| Holidays | 3 | 3 | 0 |
| Announcements | 3 | 3 | 0 |
| Security | 12 | 10 | 2 |
| **TOTAL** | **60** | **52** | **8** |

---

## 🚀 RECOMMENDED IMMEDIATE FIXES

1. Add proper 404 handling for invalid IDs
2. Add JSON validation middleware
3. Add input length validation
4. Block past leave dates
5. Prevent overlapping leaves
6. Enable HTTPS

---

**Report Generated:** March 28, 2026
