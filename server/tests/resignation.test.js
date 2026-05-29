import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockDb, makeTable } = vi.hoisted(() => {
  const makeTable = () => {
    const chain = vi.fn(() => chain);
    chain.select = vi.fn(() => chain);
    chain.where = vi.fn(() => chain);
    chain.whereIn = vi.fn(() => chain);
    chain.orderBy = vi.fn(() => chain);
    chain.first = vi.fn();
    chain.insert = vi.fn();
    chain.update = vi.fn(() => chain);
    chain.limit = vi.fn(() => chain);
    chain.offset = vi.fn(() => chain);
    chain.clearSelect = vi.fn(() => chain);
    chain.count = vi.fn(() => [{ count: "0" }]);
    chain.join = vi.fn(() => chain);
    chain.leftJoin = vi.fn(() => chain);
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
vi.mock("../controller/notificationController.js", () => ({ createNotification: vi.fn() }));

const { submitResignation, listResignations, updateResignationStatus } = await import("../controller/resignationController.js");

describe("Resignation Controller", () => {
  beforeEach(() => {
    mockDb.mockImplementation(() => makeTable());
  });

  describe("submitResignation", () => {
    it("should submit a resignation", async () => {
      const res = { status: vi.fn(() => res), json: vi.fn() };
      const table = makeTable();
      table.first = vi.fn()
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce({ id: "r1", user_id: "u1", reason: "New opportunity", status: "Pending" });
      mockDb.mockImplementation(() => table);

      await submitResignation({ user: { _id: "u1", role: "developer" }, body: { reason: "New opportunity", lastWorkingDay: "2026-03-15" }, ip: "127.0.0.1" }, res, vi.fn());

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });

    it("should fail when reason or lastWorkingDay missing", async () => {
      const res = { status: vi.fn(() => res), json: vi.fn() };

      await submitResignation({ user: { _id: "u1", role: "developer" }, body: { reason: "test" }, ip: "127.0.0.1" }, res, vi.fn());

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should fail if user already has a pending resignation", async () => {
      const res = { status: vi.fn(() => res), json: vi.fn() };
      const table = makeTable();
      table.first = vi.fn().mockResolvedValueOnce({ id: "r_existing", status: "Pending" });
      mockDb.mockImplementation(() => table);

      await submitResignation({ user: { _id: "u1", role: "developer" }, body: { reason: "New", lastWorkingDay: "2026-03-15" }, ip: "127.0.0.1" }, res, vi.fn());

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe("listResignations", () => {
    it("should list all for admin", async () => {
      const res = { json: vi.fn() };
      const resignations = [{ id: "r1", user_name: "Test", status: "Pending" }];
      let cloneCall = 0;
      const table = makeTable();
      table.clone = vi.fn(() => {
        cloneCall++;
        const c = makeTable();
        c.clearSelect = vi.fn(() => c);
        if (cloneCall === 1) { c.count = vi.fn(() => [{ count: "1" }]); c.then = vi.fn((cb) => cb([{ count: "1" }])); }
        else { c.then = vi.fn((cb) => cb(resignations)); }
        return c;
      });
      table.then = vi.fn((cb) => cb(resignations));
      mockDb.mockImplementation(() => table);

      await listResignations({ user: { _id: "u1", role: "admin" }, query: {} }, res, vi.fn());

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });

    it("should scope to own for non-admin", async () => {
      const res = { json: vi.fn() };
      let cloneCall = 0;
      const table = makeTable();
      table.clone = vi.fn(() => {
        cloneCall++;
        const c = makeTable();
        c.clearSelect = vi.fn(() => c);
        if (cloneCall === 1) { c.count = vi.fn(() => [{ count: "1" }]); c.then = vi.fn((cb) => cb([{ count: "1" }])); }
        else { c.then = vi.fn((cb) => cb([{ id: "r1" }])); }
        return c;
      });
      mockDb.mockImplementation(() => table);

      await listResignations({ user: { _id: "u1", role: "developer" }, query: {} }, res, vi.fn());

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });
  });

  describe("updateResignationStatus", () => {
    it("should approve a resignation", async () => {
      const res = { json: vi.fn() };
      const table = makeTable();
      table.first = vi.fn().mockResolvedValueOnce({ id: "r1", status: "Pending" });
      mockDb.mockImplementation(() => table);

      await updateResignationStatus({ user: { _id: "u1", role: "admin" }, params: { id: "r1" }, body: { status: "Approved" }, ip: "127.0.0.1" }, res, vi.fn());

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });

    it("should reject unauthorized roles", async () => {
      const res = { status: vi.fn(() => res), json: vi.fn() };

      await updateResignationStatus({ user: { _id: "u1", role: "developer" }, params: { id: "r1" }, body: { status: "Approved" } }, res, vi.fn());

      expect(res.status).toHaveBeenCalledWith(403);
    });

    it("should reject invalid status", async () => {
      const res = { status: vi.fn(() => res), json: vi.fn() };

      await updateResignationStatus({ user: { _id: "u1", role: "admin" }, params: { id: "r1" }, body: { status: "Invalid" } }, res, vi.fn());

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 404 if not found", async () => {
      const res = { status: vi.fn(() => res), json: vi.fn() };
      const table = makeTable();
      table.first = vi.fn().mockResolvedValueOnce(undefined);
      mockDb.mockImplementation(() => table);

      await updateResignationStatus({ user: { _id: "u1", role: "admin" }, params: { id: "missing" }, body: { status: "Approved" } }, res, vi.fn());

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should reject if already processed", async () => {
      const res = { status: vi.fn(() => res), json: vi.fn() };
      const table = makeTable();
      table.first = vi.fn().mockResolvedValueOnce({ id: "r1", status: "Approved" });
      mockDb.mockImplementation(() => table);

      await updateResignationStatus({ user: { _id: "u1", role: "admin" }, params: { id: "r1" }, body: { status: "Approved" } }, res, vi.fn());

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});
