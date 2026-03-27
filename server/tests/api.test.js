import request from "supertest";
import app from "../index.js";
import db from "../config/database.js";

describe("Auth API", () => {
  let authToken;
  let testUserId;

  beforeAll(async () => {
    const [user] = await db("users")
      .insert({
        name: "Test User",
        email: `test_${Date.now()}@example.com`,
        password: "$2a$10$testhashedpassword",
        role: "developer",
      })
      .returning("*");
    testUserId = user.id;
  });

  afterAll(async () => {
    if (testUserId) {
      await db("users").where("id", testUserId).del();
    }
    await db.destroy();
  });

  describe("POST /api/auth/login", () => {
    it("should reject invalid credentials", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "wrong@test.com", password: "wrongpass" });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe("GET /api/health", () => {
    it("should return health status", async () => {
      const res = await request(app).get("/api/health");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Server is running");
    });
  });
});

describe("Validation Tests", () => {
  const { registerSchema, loginSchema, leaveRequestSchema } = await import("../utils/validators.js");

  describe("registerSchema", () => {
    it("should validate correct registration data", () => {
      const result = registerSchema.safeParse({
        name: "John Doe",
        email: "john@example.com",
        password: "Password123!",
        role: "developer",
      });
      expect(result.success).toBe(true);
    });

    it("should reject weak passwords", () => {
      const result = registerSchema.safeParse({
        name: "John",
        email: "john@example.com",
        password: "weak",
      });
      expect(result.success).toBe(false);
    });

    it("should reject invalid email", () => {
      const result = registerSchema.safeParse({
        name: "John",
        email: "invalid-email",
        password: "Password123!",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("loginSchema", () => {
    it("should validate correct login data", () => {
      const result = loginSchema.safeParse({
        email: "user@example.com",
        password: "password123",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("leaveRequestSchema", () => {
    it("should validate correct leave request", () => {
      const result = leaveRequestSchema.safeParse({
        leaveType: "Annual Leave",
        fromDate: "2024-03-01",
        toDate: "2024-03-05",
        description: "Vacation",
      });
      expect(result.success).toBe(true);
    });

    it("should reject invalid date format", () => {
      const result = leaveRequestSchema.safeParse({
        leaveType: "Annual Leave",
        fromDate: "invalid-date",
        toDate: "2024-03-05",
      });
      expect(result.success).toBe(false);
    });
  });
});

describe("Rate Limiting", () => {
  it("should enforce rate limits on API routes", async () => {
    const requests = [];
    
    for (let i = 0; i < 10; i++) {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "test@test.com", password: "wrong" });
      requests.push(res.status);
    }

    expect(requests[requests.length - 1]).toBeLessThanOrEqual(429);
  });
});

describe("Security Headers", () => {
  it("should include security headers", async () => {
    const res = await request(app).get("/api/health");

    expect(res.headers["x-content-type-options"]).toBe("nosniff");
    expect(res.headers["x-frame-options"]).toBe("SAMEORIGIN");
    expect(res.headers["x-xss-protection"]).toBe("0");
  });
});
