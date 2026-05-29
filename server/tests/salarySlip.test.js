import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockDb, makeTable } = vi.hoisted(() => {
  const makeTable = () => {
    const chain = vi.fn(() => chain);
    chain.select = vi.fn(() => chain);
    chain.where = vi.fn(() => chain);
    chain.orderBy = vi.fn(() => chain);
    chain.first = vi.fn();
    chain.insert = vi.fn();
    chain.update = vi.fn(() => chain);
    chain.limit = vi.fn(() => chain);
    chain.offset = vi.fn(() => chain);
    chain.clearSelect = vi.fn(() => chain);
    chain.count = vi.fn(() => [{ count: "0" }]);
    chain.join = vi.fn(() => chain);
    chain.clone = vi.fn(() => {
      const c = makeTable();
      c.clearSelect = vi.fn(() => c);
      c.count = vi.fn(() => [{ count: "1" }]);
      c.then = vi.fn((cb) => cb([]));
      return c;
    });
    chain.then = vi.fn((cb) => cb([]));
    return chain;
  };
  const mockDb = vi.fn(() => makeTable());
  mockDb.fn = { now: vi.fn(() => "2026-01-15T00:00:00.000Z") };
  return { mockDb, makeTable };
});

vi.mock("../config/database.js", () => ({ default: mockDb }));

const { generateSlip, listSlips, markDownloaded } = await import("../controller/salarySlipController.js");

describe("Salary Slip Controller", () => {
  beforeEach(() => {
    mockDb.mockImplementation(() => makeTable());
  });

  describe("generateSlip", () => {
    it("should generate a new salary slip", async () => {
      const res = { status: vi.fn(() => res), json: vi.fn() };
      const table = makeTable();
      table.first = vi.fn()
        .mockResolvedValueOnce({ id: "p1", user_id: "u2", basic_pay: 5000, allowances: 1000, deductions: 500, net_pay: 5500, pay_period_start: "2026-01-01" })
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce({ id: "s1", user_id: "u2", month: "Jan", year: 2026, net_pay: 5500 });
      mockDb.mockImplementation(() => table);

      await generateSlip({ user: { _id: "u1", role: "admin" }, body: { payrollId: "p1" }, ip: "127.0.0.1" }, res, vi.fn());

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });

    it("should fail when payrollId missing", async () => {
      const res = { status: vi.fn(() => res), json: vi.fn() };

      await generateSlip({ user: { _id: "u1", role: "admin" }, body: {}, ip: "127.0.0.1" }, res, vi.fn());

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should fail when payroll not found", async () => {
      const res = { status: vi.fn(() => res), json: vi.fn() };
      const table = makeTable();
      table.first = vi.fn().mockResolvedValueOnce(undefined);
      mockDb.mockImplementation(() => table);

      await generateSlip({ user: { _id: "u1", role: "admin" }, body: { payrollId: "missing" }, ip: "127.0.0.1" }, res, vi.fn());

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should return existing slip if already generated", async () => {
      const res = { json: vi.fn() };
      const table = makeTable();
      table.first = vi.fn()
        .mockResolvedValueOnce({ id: "p1", user_id: "u2", basic_pay: 5000, allowances: 1000, deductions: 500, net_pay: 5500, pay_period_start: "2026-01-01" })
        .mockResolvedValueOnce({ id: "s1", user_id: "u2", month: "Jan", year: 2026 });
      mockDb.mockImplementation(() => table);

      await generateSlip({ user: { _id: "u1", role: "admin" }, body: { payrollId: "p1" }, ip: "127.0.0.1" }, res, vi.fn());

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true, message: expect.stringMatching(/already exists/i) }));
    });
  });

  describe("listSlips", () => {
    it("should list salary slips", async () => {
      const res = { json: vi.fn() };
      const slips = [{ id: "s1", user_name: "Test", month: "Jan", year: 2026, net_pay: 5500 }];
      let cloneCall = 0;
      const table = makeTable();
      table.clone = vi.fn(() => {
        cloneCall++;
        const c = makeTable();
        c.clearSelect = vi.fn(() => c);
        if (cloneCall === 1) {
          c.count = vi.fn(() => [{ count: "1" }]);
          c.then = vi.fn((cb) => cb([{ count: "1" }]));
        } else {
          c.then = vi.fn((cb) => cb(slips));
        }
        return c;
      });
      table.then = vi.fn((cb) => cb(slips));
      mockDb.mockImplementation(() => table);

      await listSlips({ user: { _id: "u1", role: "admin" }, query: { page: "1", limit: "10" } }, res, vi.fn());

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true, slips }));
    });
  });

  describe("markDownloaded", () => {
    it("should mark slip as downloaded", async () => {
      const res = { json: vi.fn() };
      const table = makeTable();
      table.first = vi.fn().mockResolvedValueOnce({ id: "s1" });
      mockDb.mockImplementation(() => table);

      await markDownloaded({ user: { _id: "u1", role: "admin" }, params: { id: "s1" } }, res, vi.fn());

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });

    it("should return 404 if not found", async () => {
      const res = { status: vi.fn(() => res), json: vi.fn() };
      const table = makeTable();
      table.first = vi.fn().mockResolvedValueOnce(undefined);
      mockDb.mockImplementation(() => table);

      await markDownloaded({ user: { _id: "u1", role: "admin" }, params: { id: "missing" } }, res, vi.fn());

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
