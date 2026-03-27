import {
  validate,
  registerSchema,
  loginSchema,
  employeeSchema,
  leaveRequestSchema,
  paginationSchema,
} from "../utils/validators.js";

describe("Validators", () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = { body: {}, query: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  describe("registerSchema", () => {
    it("should pass with valid data", () => {
      const validData = {
        name: "John Doe",
        email: "john@example.com",
        password: "SecurePass123!",
        role: "developer",
      };
      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should fail with short name", () => {
      const invalidData = {
        name: "J",
        email: "john@example.com",
        password: "SecurePass123!",
      };
      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should fail without uppercase in password", () => {
      const invalidData = {
        name: "John",
        email: "john@example.com",
        password: "securepass123!",
      };
      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe("loginSchema", () => {
    it("should pass with valid credentials", () => {
      const validData = {
        email: "user@example.com",
        password: "password123",
      };
      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should fail with invalid email", () => {
      const invalidData = {
        email: "not-an-email",
        password: "password",
      };
      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe("leaveRequestSchema", () => {
    it("should pass with valid leave request", () => {
      const validData = {
        leaveType: "Annual Leave",
        fromDate: "2024-03-01",
        toDate: "2024-03-05",
        description: "Family vacation",
      };
      const result = leaveRequestSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should fail with invalid leave type", () => {
      const invalidData = {
        leaveType: "Invalid Type",
        fromDate: "2024-03-01",
        toDate: "2024-03-05",
      };
      const result = leaveRequestSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe("paginationSchema", () => {
    it("should apply defaults", () => {
      const result = paginationSchema.parse({});
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
    });

    it("should coerce string numbers", () => {
      const result = paginationSchema.parse({ page: "2", limit: "50" });
      expect(result.page).toBe(2);
      expect(result.limit).toBe(50);
    });

    it("should reject limit over 100", () => {
      const result = paginationSchema.safeParse({ limit: 150 });
      expect(result.success).toBe(false);
    });
  });

  describe("validate middleware", () => {
    it("should call next() on valid data", () => {
      mockReq.body = {
        name: "John Doe",
        email: "john@example.com",
        password: "SecurePass123!",
      };

      validate(registerSchema)(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.validated).toBeDefined();
    });

    it("should return 400 on invalid data", () => {
      mockReq.body = {
        name: "J",
        email: "invalid",
        password: "weak",
      };

      validate(registerSchema)(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: "Validation failed",
        })
      );
    });
  });
});
