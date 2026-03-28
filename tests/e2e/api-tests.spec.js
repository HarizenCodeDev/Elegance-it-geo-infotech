import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = process.env.TEST_URL || 'http://192.168.29.205';
const API_BASE = `${BASE_URL}/api`;

// Test credentials
const CREDENTIALS = {
  root: { email: 'mrnobody@elegance.com', password: 'mrnobody009' },
  admin: { email: 'admin@elegance.com', password: 'admin123' },
  developer: { email: 'sathis@example.com', password: 'developer123' },
};

let authToken = '';
let testEmployeeId = null;

// Helper to get auth token
async function getAuthToken(page, credentials = CREDENTIALS.root) {
  const response = await page.request.post(`${API_BASE}/auth/login`, {
    data: credentials,
  });
  const data = await response.json();
  if (data.token) {
    return data.token;
  }
  throw new Error('Failed to get auth token');
}

// Helper to set auth header
function getAuthHeaders(token) {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}

// ============ AUTH TESTS ============

test.describe('Authentication Module', () => {
  test('AUTH-01: Login with valid credentials', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="email"]', CREDENTIALS.root.email);
    await page.fill('input[name="password"]', CREDENTIALS.root.password);
    await page.click('button[type="submit"]');
    
    // Wait for redirect to dashboard
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    expect(page.url()).toContain('dashboard');
  });

  test('AUTH-02: Login with invalid credentials', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="email"]', 'invalid@email.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // Should show error message
    await expect(page.locator('text=/error|invalid|failed/i')).toBeVisible({ timeout: 5000 });
  });

  test('AUTH-03: Logout functionality', async ({ page }) => {
    // First login
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="email"]', CREDENTIALS.root.email);
    await page.fill('input[name="password"]', CREDENTIALS.root.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    
    // Then logout
    await page.click('button:has-text("Logout"), button:has-text("Log Out")');
    await page.waitForURL('**/login', { timeout: 5000 });
  });
});

// ============ EMPLOYEE TESTS ============

test.describe('Employee Management Module', () => {
  let employeeId;

  test.beforeAll(async ({ request }) => {
    // Get auth token
    const loginRes = await request.post(`${API_BASE}/auth/login`, {
      data: CREDENTIALS.root,
    });
    const loginData = await loginRes.json();
    authToken = loginData.token;
  });

  test('EMP-01: Add new employee via API', async ({ request }) => {
    const timestamp = Date.now();
    const newEmployee = {
      name: `Test Employee ${timestamp}`,
      email: `test.${timestamp}@elegance.com`,
      password: 'Test123456',
      role: 'developer',
      department: 'Development',
      branch: 'bengaluru',
    };

    const response = await request.post(`${API_BASE}/employees`, {
      headers: getAuthHeaders(authToken),
      data: newEmployee,
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.user).toBeDefined();
    
    testEmployeeId = data.user?.id || data.user?._id;
    console.log(`Created employee with ID: ${testEmployeeId}`);
  });

  test('EMP-02: Get employee list', async ({ request }) => {
    const response = await request.get(`${API_BASE}/employees`, {
      headers: getAuthHeaders(authToken),
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.employees)).toBe(true);
  });

  test('EMP-03: Get single employee', async ({ request }) => {
    if (!testEmployeeId) {
      console.log('Skipping - no test employee created');
      return;
    }

    const response = await request.get(`${API_BASE}/employees/${testEmployeeId}`, {
      headers: getAuthHeaders(authToken),
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.employee).toBeDefined();
  });
});

// ============ LEAVE TESTS ============

test.describe('Leave Management Module', () => {
  let leaveId;

  test.beforeAll(async ({ request }) => {
    if (!authToken) {
      const loginRes = await request.post(`${API_BASE}/auth/login`, {
        data: CREDENTIALS.root,
      });
      const loginData = await loginRes.json();
      authToken = loginData.token;
    }
  });

  test('LEAVE-01: Apply for leave', async ({ request }) => {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    const leaveData = {
      type: 'Annual Leave',
      from: today.toISOString().split('T')[0],
      to: nextWeek.toISOString().split('T')[0],
      description: 'Test leave request',
    };

    const response = await request.post(`${API_BASE}/leaves`, {
      headers: getAuthHeaders(authToken),
      data: leaveData,
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.leave).toBeDefined();
    
    leaveId = data.leave?._id;
    console.log(`Created leave with ID: ${leaveId}`);
  });

  test('LEAVE-02: Get leave balance', async ({ request }) => {
    const response = await request.get(`${API_BASE}/leave-balance/balance`, {
      headers: getAuthHeaders(authToken),
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.balances)).toBe(true);
  });

  test('LEAVE-03: List all leaves', async ({ request }) => {
    const response = await request.get(`${API_BASE}/leaves`, {
      headers: getAuthHeaders(authToken),
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.leaves)).toBe(true);
  });

  test('LEAVE-04: Approve leave request', async ({ request }) => {
    if (!leaveId) {
      console.log('Skipping - no test leave created');
      return;
    }

    const response = await request.put(`${API_BASE}/leaves/${leaveId}`, {
      headers: getAuthHeaders(authToken),
      data: { status: 'Approved' },
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
  });
});

// ============ CHECK-IN TESTS ============

test.describe('Check-In/Check-Out Module', () => {
  test.beforeAll(async ({ request }) => {
    if (!authToken) {
      const loginRes = await request.post(`${API_BASE}/auth/login`, {
        data: CREDENTIALS.root,
      });
      const loginData = await loginRes.json();
      authToken = loginData.token;
    }
  });

  test('ATT-01: Check-in', async ({ request }) => {
    const response = await request.post(`${API_BASE}/checkin/checkin`, {
      headers: getAuthHeaders(authToken),
      data: {},
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.record).toBeDefined();
  });

  test('ATT-02: Check-out', async ({ request }) => {
    const response = await request.post(`${API_BASE}/checkin/checkout`, {
      headers: getAuthHeaders(authToken),
      data: {},
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.session).toBeDefined();
  });

  test('ATT-03: Get my check-in records', async ({ request }) => {
    const response = await request.get(`${API_BASE}/checkin/my-records`, {
      headers: getAuthHeaders(authToken),
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.records) || data.records).toBeDefined();
  });
});

// ============ HOLIDAY TESTS ============

test.describe('Holiday Management Module', () => {
  let holidayId;

  test.beforeAll(async ({ request }) => {
    if (!authToken) {
      const loginRes = await request.post(`${API_BASE}/auth/login`, {
        data: CREDENTIALS.root,
      });
      const loginData = await loginRes.json();
      authToken = loginData.token;
    }
  });

  test('HOL-01: Get holidays', async ({ request }) => {
    const year = new Date().getFullYear();
    const response = await request.get(`${API_BASE}/holidays?year=${year}`, {
      headers: getAuthHeaders(authToken),
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.holidays)).toBe(true);
  });

  test('HOL-02: Create holiday', async ({ request }) => {
    const nextYear = new Date().getFullYear() + 1;
    const holidayData = {
      name: 'Test Holiday',
      date: `${nextYear}-01-01`,
      type: 'public',
      description: 'Test holiday description',
    };

    const response = await request.post(`${API_BASE}/holidays`, {
      headers: getAuthHeaders(authToken),
      data: holidayData,
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.holiday).toBeDefined();
    
    holidayId = data.holiday?._id;
  });

  test('HOL-03: Delete holiday', async ({ request }) => {
    if (!holidayId) {
      console.log('Skipping - no test holiday created');
      return;
    }

    const response = await request.delete(`${API_BASE}/holidays/${holidayId}`, {
      headers: getAuthHeaders(authToken),
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
  });
});

// ============ ANNOUNCEMENT TESTS ============

test.describe('Announcement Module', () => {
  let announcementId;

  test.beforeAll(async ({ request }) => {
    if (!authToken) {
      const loginRes = await request.post(`${API_BASE}/auth/login`, {
        data: CREDENTIALS.root,
      });
      const loginData = await loginRes.json();
      authToken = loginData.token;
    }
  });

  test('ANN-01: Create announcement', async ({ request }) => {
    const announcementData = {
      title: 'Test Announcement',
      message: 'This is a test announcement message for QA testing purposes.',
      audienceRoles: ['all'],
    };

    const response = await request.post(`${API_BASE}/announcements`, {
      headers: getAuthHeaders(authToken),
      data: announcementData,
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.announcement).toBeDefined();
    
    announcementId = data.announcement?._id;
  });

  test('ANN-02: List announcements', async ({ request }) => {
    const response = await request.get(`${API_BASE}/announcements`, {
      headers: getAuthHeaders(authToken),
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.announcements)).toBe(true);
  });
});

// ============ NOTIFICATION TESTS ============

test.describe('Notification Module', () => {
  test('NOT-01: Get notifications', async ({ request }) => {
    if (!authToken) {
      const loginRes = await request.post(`${API_BASE}/auth/login`, {
        data: CREDENTIALS.root,
      });
      const loginData = await loginRes.json();
      authToken = loginData.token;
    }

    const response = await request.get(`${API_BASE}/notifications`, {
      headers: getAuthHeaders(authToken),
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.notifications)).toBe(true);
  });
});

// ============ ACTIVITY LOG TESTS ============

test.describe('Activity Log Module', () => {
  test('LOG-01: Get activity logs', async ({ request }) => {
    if (!authToken) {
      const loginRes = await request.post(`${API_BASE}/auth/login`, {
        data: CREDENTIALS.root,
      });
      const loginData = await loginRes.json();
      authToken = loginData.token;
    }

    const response = await request.get(`${API_BASE}/activity-logs`, {
      headers: getAuthHeaders(authToken),
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
  });
});

// ============ REPORT GENERATION ============

test.afterAll(async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Take a screenshot of the final state
  await page.goto(BASE_URL);
  await page.screenshot({ path: 'test-results/final-state.png', fullPage: true });
  
  // Generate test report
  const report = {
    timestamp: new Date().toISOString(),
    environment: BASE_URL,
    tests: 'See Playwright report for details',
  };
  
  fs.writeFileSync(
    'test-results/test-report.json',
    JSON.stringify(report, null, 2)
  );
  
  console.log('Test execution completed. Report generated.');
});
