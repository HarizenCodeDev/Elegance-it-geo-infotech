import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockDb, makeTable } = vi.hoisted(() => {
  const makeTable = () => {
    const chain = vi.fn(() => chain);
    chain.select = vi.fn(() => chain);
    chain.where = vi.fn(() => chain);
    chain.whereIn = vi.fn(() => chain);
    chain.whereBetween = vi.fn(() => chain);
    chain.orderBy = vi.fn(() => chain);
    chain.first = vi.fn();
    chain.insert = vi.fn();
    chain.update = vi.fn(() => chain);
    chain.del = vi.fn();
    chain.limit = vi.fn(() => chain);
    chain.offset = vi.fn(() => chain);
    chain.clearSelect = vi.fn(() => chain);
    chain.count = vi.fn(() => [{ count: "0" }]);
    chain.join = vi.fn(() => chain);
    chain.leftJoin = vi.fn(() => chain);
    chain.clone = vi.fn(() => chain);
    chain.then = vi.fn((cb) => cb([]));
    return chain;
  };

  const mockDb = vi.fn(() => makeTable());
  mockDb.fn = { now: vi.fn(() => "2026-01-15T00:00:00.000Z") };
  return { mockDb, makeTable };
});

vi.mock("../config/database.js", () => ({ default: mockDb }));

const { processPayroll, listPayroll, getPayroll, deletePayroll } = await import("../controller/payrollController.js");

const makeReqRes = (overrides = {}) => ({
  user: { _id: "u1", role: "admin", employee_id: "EJB0001", ...overrides.user },
  body: {},
  query: {},
  params: {},
  ip: "127.0.0.1",
  ...overrides,
  res: { status: vi.fn(() => overrides.res?.json ? overrides.res : { json: vi.fn() }), json: vi.fn() },
  next: vi.fn(),
});

describe("Payroll Controller", () => {
  beforeEach(() => {
    mockDb.mockImplementation(() => makeTable());
  });

  describe("processPayroll", () => {
    it("should process a new payroll", async () => {
      const { res, next } = makeReqRes({
        body: { userId: "u2", basicPay: "5000", allowances: "1000", deductions: "500", payPeriodStart: "2026-01-01", payPeriodEnd: "2026-01-31" },
      });
      const table = makeTable();
      table.first = vi.fn()
        .mockResolvedValueOnce({ id: "u2", name: "User" })
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce({ id: "p1", user_id: "u2", basic_pay: 5000, allowances: 1000, deductions: 500, net_pay: 5500 });
      mockDb.mockImplementation(() => table);

      await processPayroll({ user: { _id: "u1", role: "admin" }, body: { userId: "u2", basicPay: "5000", allowances: "1000", deductions: "500", payPeriodStart: "2026-01-01", payPeriodEnd: "2026-01-31" }, ip: "127.0.0.1" }, res, next);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });

    it("should reject unauthorized roles", async () => {
      const res = { status: vi.fn(() => res), json: vi.fn() };

      await processPayroll({ user: { _id: "u1", role: "developer" }, body: { userId: "u2", payPeriodStart: "2026-01-01", payPeriodEnd: "2026-01-31" }, ip: "127.0.0.1" }, res, vi.fn());

      expect(res.status).toHaveBeenCalledWith(403);
    });

    it("should fail when required fields missing", async () => {
      const res = { status: vi.fn(() => res), json: vi.fn() };

      await processPayroll({ user: { _id: "u1", role: "admin" }, body: { userId: "u2" }, ip: "127.0.0.1" }, res, vi.fn());

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should fail when user not found", async () => {
      const res = { status: vi.fn(() => res), json: vi.fn() };
      const table = makeTable();
      table.first = vi.fn().mockResolvedValueOnce(undefined);
      mockDb.mockImplementation(() => table);

      await processPayroll({ user: { _id: "u1", role: "admin" }, body: { userId: "missing", payPeriodStart: "2026-01-01", payPeriodEnd: "2026-01-31" }, ip: "127.0.0.1" }, res, vi.fn());

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe("listPayroll", () => {
    it("should list payroll records", async () => {
      const res = { json: vi.fn() };
      const records = [{ id: "p1", user_name: "Test", basic_pay: 5000 }];
      const table = makeTable();
      let cloneCall = 0;
      table.clone = vi.fn(() => {
        cloneCall++;
        const c = makeTable();
        c.clearSelect = vi.fn(() => c);
        if (cloneCall === 1) {
          c.count = vi.fn(() => [{ count: "1" }]);
          c.then = vi.fn((cb) => cb([{ count: "1" }]));
        } else {
          c.then = vi.fn((cb) => cb(records));
        }
        return c;
      });
      table.then = vi.fn((cb) => cb(records));
      mockDb.mockImplementation(() => table);

      await listPayroll({ user: { _id: "u1", role: "admin" }, query: { page: "1", limit: "10" } }, res, vi.fn());

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true, payroll: records }));
    });
  });

  describe("getPayroll", () => {
    it("should return a payroll record", async () => {
      const res = { json: vi.fn() };
      const table = makeTable();
      table.first = vi.fn().mockResolvedValueOnce({ id: "p1", basic_pay: 5000 });
      mockDb.mockImplementation(() => table);

      await getPayroll({ user: { _id: "u1", role: "admin" }, params: { id: "p1" } }, res, vi.fn());

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });

    it("should return 404 if not found", async () => {
      const res = { status: vi.fn(() => res), json: vi.fn() };
      const table = makeTable();
      table.first = vi.fn().mockResolvedValueOnce(undefined);
      mockDb.mockImplementation(() => table);

      await getPayroll({ user: { _id: "u1", role: "admin" }, params: { id: "missing" } }, res, vi.fn());

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe("deletePayroll", () => {
    it("should delete a payroll record", async () => {
      const res = { json: vi.fn() };
      const table = makeTable();
      table.del = vi.fn().mockResolvedValueOnce(1);
      mockDb.mockImplementation(() => table);

      await deletePayroll({ user: { _id: "u1", role: "admin" }, params: { id: "p1" }, ip: "127.0.0.1" }, res, vi.fn());

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });

    it("should reject unauthorized roles", async () => {
      const res = { status: vi.fn(() => res), json: vi.fn() };

      await deletePayroll({ user: { _id: "u1", role: "developer" }, params: { id: "p1" }, ip: "127.0.0.1" }, res, vi.fn());

      expect(res.status).toHaveBeenCalledWith(403);
    });
  });
});
