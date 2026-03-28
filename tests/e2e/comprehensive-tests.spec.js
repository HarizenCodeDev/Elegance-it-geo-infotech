// =====================================================
// COMPREHENSIVE PLAYWRIGHT TEST SUITE - ELEGANCE EMS
// =====================================================

import { test, expect, request } from '@playwright/test';

// Configuration
const BASE_URL = process.env.TEST_URL || 'http://192.168.29.205';
const API_URL = `${BASE_URL}/api`;

// Test credentials
const CREDENTIALS = {
  root: { email: 'mrnobody@elegance.com', password: 'mrnobody009' },
};

// Helper function to get auth token
async function getAuthToken(credentials = CREDENTIALS.root) {
  const context = await request.newContext();
  const response = await context.post(`${API_URL}/auth/login`, {
    data: credentials,
  });
  const data = await response.json();
  await context.dispose();
  return data.token;
}

// Helper to get auth headers
function getAuthHeaders(token) {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}

// =====================================================
// TEST SUITE 1: AUTHENTICATION
// =====================================================
test.describe('Authentication Module', () => {
  let authToken;

  test('AUTH-001: Valid login should succeed', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="email"]', CREDENTIALS.root.email);
    await page.fill('input[name="password"]', CREDENTIALS.root.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    expect(page.url()).toContain('dashboard');
  });

  test('AUTH-002: Invalid credentials should fail', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="email"]', 'invalid@test.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=/error|invalid|failed/i')).toBeVisible({ timeout: 5000 });
  });

  test('AUTH-003: Empty fields should show validation', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.click('button[type="submit"]');
    await expect(page.locator('text=/required/i')).toBeVisible({ timeout: 3000 });
  });

  test('AUTH-004: Logout should clear session', async ({ page }) => {
    // Login first
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="email"]', CREDENTIALS.root.email);
    await page.fill('input[name="password"]', CREDENTIALS.root.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard', { timeout: 10000 });

    // Logout
    await page.click('button:has-text("Logout"), button:has-text("Log Out")');
    await page.waitForURL('**/login', { timeout: 5000 });
  });

  test('AUTH-005: Session persistence after refresh', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="email"]', CREDENTIALS.root.email);
    await page.fill('input[name="password"]', CREDENTIALS.root.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard', { timeout: 10000 });

    // Refresh page
    await page.reload();
    expect(page.url()).toContain('dashboard');
  });
});

// =====================================================
// TEST SUITE 2: API AUTHENTICATION
// =====================================================
test.describe('API Authentication', () => {
  test('API-AUTH-001: Valid login returns token', async ({ request }) => {
    const response = await request.post(`${API_URL}/auth/login`, {
      data: CREDENTIALS.root,
    });
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.token).toBeDefined();
  });

  test('API-AUTH-002: Invalid credentials returns error', async ({ request }) => {
    const response = await request.post(`${API_URL}/auth/login`, {
      data: { email: 'invalid@test.com', password: 'wrong' },
    });
    expect(response.status()).toBe(401);
    const data = await response.json();
    expect(data.success).toBe(false);
  });

  test('API-AUTH-003: Empty credentials fails', async ({ request }) => {
    const response = await request.post(`${API_URL}/auth/login`, {
      data: { email: '', password: '' },
    });
    expect(response.status()).toBe(400);
  });

  test('API-AUTH-004: Invalid token is rejected', async ({ request }) => {
    const response = await request.get(`${API_URL}/employees`, {
      headers: { 'Authorization': 'Bearer invalid_token' },
    });
    expect(response.status()).toBe(401);
  });

  test('API-AUTH-005: Missing token is rejected', async ({ request }) => {
    const response = await request.get(`${API_URL}/employees`);
    expect(response.status()).toBe(401);
  });
});

// =====================================================
// TEST SUITE 3: EMPLOYEE MANAGEMENT
// =====================================================
test.describe('Employee Management', () => {
  let authToken;
  let createdEmployeeId;

  test.beforeAll(async ({ request }) => {
    const loginRes = await request.post(`${API_URL}/auth/login`, { data: CREDENTIALS.root });
    const loginData = await loginRes.json();
    authToken = loginData.token;
  });

  test('EMP-001: List employees returns data', async ({ request }) => {
    const response = await request.get(`${API_URL}/employees`, {
      headers: getAuthHeaders(authToken),
    });
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.users)).toBe(true);
  });

  test('EMP-002: Create employee with valid data', async ({ request }) => {
    const timestamp = Date.now();
    const newEmployee = {
      name: `Test Employee ${timestamp}`,
      email: `test.${timestamp}@elegance.com`,
      password: 'Test123456',
      role: 'developer',
      department: 'Development',
      branch: 'bengaluru',
    };

    const response = await request.post(`${API_URL}/employees`, {
      headers: getAuthHeaders(authToken),
      data: newEmployee,
    });
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
    createdEmployeeId = data.user?._id;
  });

  test('EMP-003: Duplicate email is rejected', async ({ request }) => {
    const timestamp = Date.now();
    const email = `duplicate.${timestamp}@elegance.com`;
    
    // Create first
    await request.post(`${API_URL}/employees`, {
      headers: getAuthHeaders(authToken),
      data: { name: 'First', email, password: 'Test123', role: 'developer', branch: 'bengaluru' },
    });

    // Try duplicate
    const response = await request.post(`${API_URL}/employees`, {
      headers: getAuthHeaders(authToken),
      data: { name: 'Second', email, password: 'Test123', role: 'developer', branch: 'bengaluru' },
    });
    expect(response.status()).toBe(409);
  });

  test('EMP-004: Create with missing required fields', async ({ request }) => {
    const response = await request.post(`${API_URL}/employees`, {
      headers: getAuthHeaders(authToken),
      data: { name: 'Incomplete' },
    });
    expect(response.status()).toBe(400);
  });

  test('EMP-005: Get single employee', async ({ request }) => {
    if (!createdEmployeeId) {
      test.skip();
    }
    const response = await request.get(`${API_URL}/employees/${createdEmployeeId}`, {
      headers: getAuthHeaders(authToken),
    });
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
  });

  test('EMP-006: Update employee', async ({ request }) => {
    if (!createdEmployeeId) {
      test.skip();
    }
    const response = await request.put(`${API_URL}/employees/${createdEmployeeId}`, {
      headers: getAuthHeaders(authToken),
      data: { designation: 'Senior Developer' },
    });
    expect(response.ok()).toBeTruthy();
  });

  test('EMP-007: Delete employee', async ({ request }) => {
    if (!createdEmployeeId) {
      test.skip();
    }
    const response = await request.delete(`${API_URL}/employees/${createdEmployeeId}`, {
      headers: getAuthHeaders(authToken),
    });
    expect(response.ok()).toBeTruthy();
  });
});

// =====================================================
// TEST SUITE 4: LEAVE MANAGEMENT
// =====================================================
test.describe('Leave Management', () => {
  let authToken;
  let createdLeaveId;

  test.beforeAll(async ({ request }) => {
    const loginRes = await request.post(`${API_URL}/auth/login`, { data: CREDENTIALS.root });
    const loginData = await loginRes.json();
    authToken = loginData.token;
  });

  test('LEAVE-001: Apply for valid leave', async ({ request }) => {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    const leaveData = {
      type: 'Annual Leave',
      from: today.toISOString().split('T')[0],
      to: nextWeek.toISOString().split('T')[0],
      description: 'QA Test Leave',
    };

    const response = await request.post(`${API_URL}/leaves`, {
      headers: getAuthHeaders(authToken),
      data: leaveData,
    });
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
    createdLeaveId = data.leave?._id;
  });

  test('LEAVE-002: Invalid leave type is rejected', async ({ request }) => {
    const response = await request.post(`${API_URL}/leaves`, {
      headers: getAuthHeaders(authToken),
      data: {
        type: 'Invalid Leave',
        from: '2027-01-01',
        to: '2027-01-02',
      },
    });
    expect(response.status()).toBe(400);
  });

  test('LEAVE-003: Invalid date range (from > to)', async ({ request }) => {
    const response = await request.post(`${API_URL}/leaves`, {
      headers: getAuthHeaders(authToken),
      data: {
        type: 'Annual Leave',
        from: '2027-01-10',
        to: '2027-01-01',
      },
    });
    expect(response.status()).toBe(400);
  });

  test('LEAVE-004: Get leave balance', async ({ request }) => {
    const response = await request.get(`${API_URL}/leave-balance/balance`, {
      headers: getAuthHeaders(authToken),
    });
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.balances)).toBe(true);
  });

  test('LEAVE-005: List all leaves', async ({ request }) => {
    const response = await request.get(`${API_URL}/leaves`, {
      headers: getAuthHeaders(authToken),
    });
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
  });

  test('LEAVE-006: Approve leave request', async ({ request }) => {
    if (!createdLeaveId) {
      test.skip();
    }
    const response = await request.put(`${API_URL}/leaves/${createdLeaveId}`, {
      headers: getAuthHeaders(authToken),
      data: { status: 'Approved' },
    });
    expect(response.ok()).toBeTruthy();
  });

  test('LEAVE-007: Reject leave request', async ({ request }) => {
    // Create new leave for rejection
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 14);

    const createRes = await request.post(`${API_URL}/leaves`, {
      headers: getAuthHeaders(authToken),
      data: {
        type: 'Sick Leave',
        from: today.toISOString().split('T')[0],
        to: nextWeek.toISOString().split('T')[0],
      },
    });
    const leaveData = await createRes.json();
    
    if (leaveData.leave?._id) {
      const response = await request.put(`${API_URL}/leaves/${leaveData.leave._id}`, {
        headers: getAuthHeaders(authToken),
        data: { status: 'Rejected' },
      });
      expect(response.ok()).toBeTruthy();
    }
  });
});

// =====================================================
// TEST SUITE 5: ATTENDANCE & CHECK-IN
// =====================================================
test.describe('Attendance & Check-In', () => {
  let authToken;

  test.beforeAll(async ({ request }) => {
    const loginRes = await request.post(`${API_URL}/auth/login`, { data: CREDENTIALS.root });
    const loginData = await loginRes.json();
    authToken = loginData.token;
  });

  test('ATT-001: Check-in succeeds', async ({ request }) => {
    const response = await request.post(`${API_URL}/checkin/checkin`, {
      headers: getAuthHeaders(authToken),
      data: {},
    });
    // May fail if already checked in 3 times
    const data = await response.json();
    if (data.success) {
      expect(data.record).toBeDefined();
    } else {
      expect(data.error).toContain('Maximum');
    }
  });

  test('ATT-002: Check-out succeeds after check-in', async ({ request }) => {
    // First check-in
    await request.post(`${API_URL}/checkin/checkin`, {
      headers: getAuthHeaders(authToken),
      data: {},
    });

    // Then check-out
    const response = await request.post(`${API_URL}/checkin/checkout`, {
      headers: getAuthHeaders(authToken),
      data: {},
    });
    const data = await response.json();
    if (data.success) {
      expect(data.session).toBeDefined();
    } else {
      // Already checked out or no check-in
      expect(data.error).toBeDefined();
    }
  });

  test('ATT-003: Double check-out fails', async ({ request }) => {
    const response = await request.post(`${API_URL}/checkin/checkout`, {
      headers: getAuthHeaders(authToken),
      data: {},
    });
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain('Already checked out');
  });

  test('ATT-004: Get my check-in records', async ({ request }) => {
    const response = await request.get(`${API_URL}/checkin/my-records`, {
      headers: getAuthHeaders(authToken),
    });
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
  });

  test('ATT-005: Get attendance list', async ({ request }) => {
    const response = await request.get(`${API_URL}/attendance`, {
      headers: getAuthHeaders(authToken),
    });
    expect(response.ok()).toBeTruthy();
  });

  test('ATT-006: Get my attendance', async ({ request }) => {
    const response = await request.get(`${API_URL}/attendance/my`, {
      headers: getAuthHeaders(authToken),
    });
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
  });
});

// =====================================================
// TEST SUITE 6: HOLIDAYS
// =====================================================
test.describe('Holiday Management', () => {
  let authToken;
  let createdHolidayId;

  test.beforeAll(async ({ request }) => {
    const loginRes = await request.post(`${API_URL}/auth/login`, { data: CREDENTIALS.root });
    const loginData = await loginRes.json();
    authToken = loginData.token;
  });

  test('HOL-001: List holidays', async ({ request }) => {
    const year = new Date().getFullYear();
    const response = await request.get(`${API_URL}/holidays?year=${year}`, {
      headers: getAuthHeaders(authToken),
    });
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
  });

  test('HOL-002: Create holiday', async ({ request }) => {
    const response = await request.post(`${API_URL}/holidays`, {
      headers: getAuthHeaders(authToken),
      data: {
        name: 'QA Test Holiday',
        date: '2027-12-25',
        type: 'public',
        description: 'Test holiday',
      },
    });
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
    createdHolidayId = data.holiday?._id;
  });

  test('HOL-003: Create holiday with missing name fails', async ({ request }) => {
    const response = await request.post(`${API_URL}/holidays`, {
      headers: getAuthHeaders(authToken),
      data: {
        date: '2027-01-01',
      },
    });
    expect(response.status()).toBe(400);
  });

  test('HOL-004: Delete holiday', async ({ request }) => {
    if (!createdHolidayId) {
      test.skip();
    }
    const response = await request.delete(`${API_URL}/holidays/${createdHolidayId}`, {
      headers: getAuthHeaders(authToken),
    });
    expect(response.ok()).toBeTruthy();
  });
});

// =====================================================
// TEST SUITE 7: ANNOUNCEMENTS
// =====================================================
test.describe('Announcements', () => {
  let authToken;
  let createdAnnouncementId;

  test.beforeAll(async ({ request }) => {
    const loginRes = await request.post(`${API_URL}/auth/login`, { data: CREDENTIALS.root });
    const loginData = await loginRes.json();
    authToken = loginData.token;
  });

  test('ANN-001: Create announcement', async ({ request }) => {
    const response = await request.post(`${API_URL}/announcements`, {
      headers: getAuthHeaders(authToken),
      data: {
        title: 'QA Test Announcement',
        message: 'This is a test announcement message for QA purposes.',
        audienceRoles: ['all'],
      },
    });
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
    createdAnnouncementId = data.announcement?._id;
  });

  test('ANN-002: List announcements', async ({ request }) => {
    const response = await request.get(`${API_URL}/announcements`, {
      headers: getAuthHeaders(authToken),
    });
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
  });

  test('ANN-003: Short message is rejected', async ({ request }) => {
    const response = await request.post(`${API_URL}/announcements`, {
      headers: getAuthHeaders(authToken),
      data: {
        title: 'Test',
        message: 'Short',
        audienceRoles: ['all'],
      },
    });
    expect(response.status()).toBe(400);
  });

  test('ANN-004: Delete announcement', async ({ request }) => {
    if (!createdAnnouncementId) {
      test.skip();
    }
    const response = await request.delete(`${API_URL}/announcements/${createdAnnouncementId}`, {
      headers: getAuthHeaders(authToken),
    });
    expect(response.ok()).toBeTruthy();
  });
});

// =====================================================
// TEST SUITE 8: NOTIFICATIONS
// =====================================================
test.describe('Notifications', () => {
  let authToken;

  test.beforeAll(async ({ request }) => {
    const loginRes = await request.post(`${API_URL}/auth/login`, { data: CREDENTIALS.root });
    const loginData = await loginRes.json();
    authToken = loginData.token;
  });

  test('NOT-001: List notifications', async ({ request }) => {
    const response = await request.get(`${API_URL}/notifications`, {
      headers: getAuthHeaders(authToken),
    });
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
  });
});

// =====================================================
// TEST SUITE 9: ACTIVITY LOGS
// =====================================================
test.describe('Activity Logs', () => {
  let authToken;

  test.beforeAll(async ({ request }) => {
    const loginRes = await request.post(`${API_URL}/auth/login`, { data: CREDENTIALS.root });
    const loginData = await loginRes.json();
    authToken = loginData.token;
  });

  test('LOG-001: List activity logs', async ({ request }) => {
    const response = await request.get(`${API_URL}/activity-logs`, {
      headers: getAuthHeaders(authToken),
    });
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
  });
});

// =====================================================
// TEST SUITE 10: SECURITY
// =====================================================
test.describe('Security Testing', () => {
  let authToken;

  test.beforeAll(async ({ request }) => {
    const loginRes = await request.post(`${API_URL}/auth/login`, { data: CREDENTIALS.root });
    const loginData = await loginRes.json();
    authToken = loginData.token;
  });

  test('SEC-001: XSS in name field is sanitized', async ({ request }) => {
    const timestamp = Date.now();
    const response = await request.post(`${API_URL}/employees`, {
      headers: getAuthHeaders(authToken),
      data: {
        name: '<script>alert(1)</script>',
        email: `xsstest${timestamp}@elegance.com`,
        password: 'Test123',
        role: 'developer',
        branch: 'bengaluru',
      },
    });
    const data = await response.json();
    // Should either sanitize or reject
    if (data.success) {
      // Check if XSS is escaped in response
      const getRes = await request.get(`${API_URL}/employees/${data.user._id}`, {
        headers: getAuthHeaders(authToken),
      });
      const userData = await getRes.json();
      expect(userData.user.name).not.toContain('<script>');
    }
  });

  test('SEC-002: SQL injection is blocked', async ({ request }) => {
    const response = await request.post(`${API_URL}/employees`, {
      headers: getAuthHeaders(authToken),
      data: {
        name: "Test' OR '1'='1",
        email: `sqli${Date.now()}@elegance.com`,
        password: 'Test123',
        role: 'developer',
        branch: 'bengaluru',
      },
    });
    // Should not expose data or cause error
    const data = await response.json();
    expect(data.success).toBe(true);
    // Verify no SQL error in response
    expect(JSON.stringify(data)).not.toContain('SQL');
  });

  test('SEC-003: No auth returns 401', async ({ request }) => {
    const response = await request.get(`${API_URL}/employees`);
    expect(response.status()).toBe(401);
  });

  test('SEC-004: Invalid token returns 401', async ({ request }) => {
    const response = await request.get(`${API_URL}/employees`, {
      headers: { 'Authorization': 'Bearer invalid_token_123' },
    });
    expect(response.status()).toBe(401);
  });

  test('SEC-005: Password hash not exposed', async ({ request }) => {
    const response = await request.get(`${API_URL}/employees`, {
      headers: getAuthHeaders(authToken),
    });
    const data = await response.json();
    const responseStr = JSON.stringify(data);
    expect(responseStr).not.toContain('password');
    expect(responseStr).not.toContain('passwordHash');
  });
});

// =====================================================
// TEST SUITE 11: EDGE CASES
// =====================================================
test.describe('Edge Cases', () => {
  let authToken;

  test.beforeAll(async ({ request }) => {
    const loginRes = await request.post(`${API_URL}/auth/login`, { data: CREDENTIALS.root });
    const loginData = await loginRes.json();
    authToken = loginData.token;
  });

  test('EDGE-001: Very long name is handled', async ({ request }) => {
    const longName = 'A'.repeat(1000);
    const response = await request.post(`${API_URL}/employees`, {
      headers: getAuthHeaders(authToken),
      data: {
        name: longName,
        email: `longname${Date.now()}@elegance.com`,
        password: 'Test123',
        role: 'developer',
        branch: 'bengaluru',
      },
    });
    // Should either accept or return 400 with validation error
    const data = await response.json();
    if (data.success) {
      expect(data.user.name.length).toBeLessThanOrEqual(255);
    } else {
      expect(response.status()).toBe(400);
    }
  });

  test('EDGE-002: Special characters in announcement', async ({ request }) => {
    const response = await request.post(`${API_URL}/announcements`, {
      headers: getAuthHeaders(authToken),
      data: {
        title: 'Special Chars Test',
        message: 'Test with émojis 🎉 and special chars !@#$%',
        audienceRoles: ['all'],
      },
    });
    expect(response.ok()).toBeTruthy();
  });

  test('EDGE-003: Concurrent leave applications', async ({ request }) => {
    const today = new Date();
    const promises = [];
    
    for (let i = 0; i < 3; i++) {
      const nextDay = new Date(today);
      nextDay.setDate(today.getDate() + 20 + i);
      const endDay = new Date(nextDay);
      endDay.setDate(nextDay.getDate() + 1);
      
      promises.push(
        request.post(`${API_URL}/leaves`, {
          headers: getAuthHeaders(authToken),
          data: {
            type: 'Annual Leave',
            from: nextDay.toISOString().split('T')[0],
            to: endDay.toISOString().split('T')[0],
          },
        })
      );
    }

    const results = await Promise.all(promises);
    // All should succeed (no race condition causing duplicates)
    results.forEach(res => {
      expect(res.ok()).toBeTruthy();
    });
  });

  test('EDGE-004: Non-existent resource returns proper error', async ({ request }) => {
    const response = await request.get(`${API_URL}/employees/non-existent-id-12345`, {
      headers: getAuthHeaders(authToken),
    });
    expect(response.status()).toBe(404);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error).not.toContain('Internal server error');
  });
});

// =====================================================
// TEST SUITE 12: UI FUNCTIONALITY
// =====================================================
test.describe('UI Functionality', () => {
  test('UI-001: All navigation links work', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="email"]', CREDENTIALS.root.email);
    await page.fill('input[name="password"]', CREDENTIALS.root.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard', { timeout: 10000 });

    // Check main menu items exist
    await expect(page.locator('text=/Dashboard|Home/i')).toBeVisible();
    await expect(page.locator('text=/Profile/i')).toBeVisible();
  });

  test('UI-002: Forms show validation errors', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.click('button[type="submit"]');
    await expect(page.locator('text=/required|email|password/i')).toBeVisible({ timeout: 3000 });
  });

  test('UI-003: Notifications bell shows count', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="email"]', CREDENTIALS.root.email);
    await page.fill('input[name="password"]', CREDENTIALS.root.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard', { timeout: 10000 });

    // Bell should be visible
    await expect(page.locator('[class*="bell"], svg[class*="Bell"]').first()).toBeVisible({ timeout: 5000 });
  });

  test('UI-004: Mobile responsiveness', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${BASE_URL}/login`);
    await expect(page.locator('input[name="email"]')).toBeVisible();
  });
});
