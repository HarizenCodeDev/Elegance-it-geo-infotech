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
    chain.del = vi.fn();
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

const { createTask, listTasks, updateTaskStatus, deleteTask, createChecklistItem, listChecklist, toggleChecklistItem } = await import("../controller/onboardingController.js");

describe("Onboarding Controller", () => {
  beforeEach(() => {
    mockDb.mockImplementation(() => makeTable());
  });

  describe("createTask", () => {
    it("should create a task", async () => {
      const res = { status: vi.fn(() => res), json: vi.fn() };
      const table = makeTable();
      table.first = vi.fn().mockResolvedValueOnce({ id: "t1", task_name: "Setup email", status: "pending" });
      mockDb.mockImplementation(() => table);

      await createTask({ user: { _id: "u1", role: "admin" }, body: { userId: "u2", taskName: "Setup email" }, ip: "127.0.0.1" }, res, vi.fn());

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });

    it("should reject unauthorized roles", async () => {
      const res = { status: vi.fn(() => res), json: vi.fn() };

      await createTask({ user: { _id: "u1", role: "developer" }, body: { userId: "u2", taskName: "Setup email" } }, res, vi.fn());

      expect(res.status).toHaveBeenCalledWith(403);
    });

    it("should fail when fields missing", async () => {
      const res = { status: vi.fn(() => res), json: vi.fn() };

      await createTask({ user: { _id: "u1", role: "admin" }, body: { userId: "u2" } }, res, vi.fn());

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe("listTasks", () => {
    it("should list tasks with pagination", async () => {
      const res = { json: vi.fn() };
      const tasks = [{ id: "t1", task_name: "Setup email", user_name: "Test" }];
      let cloneCall = 0;
      const table = makeTable();
      table.clone = vi.fn(() => {
        cloneCall++;
        const c = makeTable();
        c.clearSelect = vi.fn(() => c);
        if (cloneCall === 1) { c.count = vi.fn(() => [{ count: "1" }]); c.then = vi.fn((cb) => cb([{ count: "1" }])); }
        else { c.then = vi.fn((cb) => cb(tasks)); }
        return c;
      });
      table.then = vi.fn((cb) => cb(tasks));
      mockDb.mockImplementation(() => table);

      await listTasks({ user: { _id: "u1", role: "admin" }, query: { page: "1", limit: "10" } }, res, vi.fn());

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });
  });

  describe("updateTaskStatus", () => {
    it("should update task to completed", async () => {
      const res = { json: vi.fn() };
      const table = makeTable();
      table.first = vi.fn().mockResolvedValueOnce({ id: "t1", status: "pending" });
      mockDb.mockImplementation(() => table);

      await updateTaskStatus({ user: { _id: "u1", role: "admin" }, params: { id: "t1" }, body: { status: "completed" } }, res, vi.fn());

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });

    it("should reject invalid status", async () => {
      const res = { status: vi.fn(() => res), json: vi.fn() };

      await updateTaskStatus({ user: { _id: "u1", role: "admin" }, params: { id: "t1" }, body: { status: "invalid" } }, res, vi.fn());

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 404 if not found", async () => {
      const res = { status: vi.fn(() => res), json: vi.fn() };
      const table = makeTable();
      table.first = vi.fn().mockResolvedValueOnce(undefined);
      mockDb.mockImplementation(() => table);

      await updateTaskStatus({ user: { _id: "u1", role: "admin" }, params: { id: "missing" }, body: { status: "completed" } }, res, vi.fn());

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe("deleteTask", () => {
    it("should delete a task", async () => {
      const res = { json: vi.fn() };

      await deleteTask({ user: { _id: "u1", role: "admin" }, params: { id: "t1" } }, res, vi.fn());

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });

    it("should reject unauthorized", async () => {
      const res = { status: vi.fn(() => res), json: vi.fn() };

      await deleteTask({ user: { _id: "u1", role: "developer" }, params: { id: "t1" } }, res, vi.fn());

      expect(res.status).toHaveBeenCalledWith(403);
    });
  });

  describe("createChecklistItem", () => {
    it("should create a checklist item", async () => {
      const res = { status: vi.fn(() => res), json: vi.fn() };
      const table = makeTable();
      table.first = vi.fn().mockResolvedValueOnce({ id: "c1", item: "HR forms", is_completed: false });
      mockDb.mockImplementation(() => table);

      await createChecklistItem({ user: { _id: "u1", role: "admin" }, body: { userId: "u2", item: "HR forms" } }, res, vi.fn());

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });

    it("should fail when fields missing", async () => {
      const res = { status: vi.fn(() => res), json: vi.fn() };

      await createChecklistItem({ user: { _id: "u1", role: "admin" }, body: {} }, res, vi.fn());

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe("listChecklist", () => {
    it("should list checklist items", async () => {
      const res = { json: vi.fn() };
      const items = [{ id: "c1", item: "HR forms", is_completed: false }];
      const table = makeTable();
      table.then = vi.fn((cb) => cb(items));
      mockDb.mockImplementation(() => table);

      await listChecklist({ user: { _id: "u1", role: "admin" }, query: {} }, res, vi.fn());

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true, checklist: items }));
    });
  });

  describe("toggleChecklistItem", () => {
    it("should toggle to completed", async () => {
      const res = { json: vi.fn() };
      const table = makeTable();
      table.first = vi.fn().mockResolvedValueOnce({ id: "c1", is_completed: false });
      mockDb.mockImplementation(() => table);

      await toggleChecklistItem({ user: { _id: "u1", role: "admin" }, params: { id: "c1" } }, res, vi.fn());

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true, is_completed: true }));
    });

    it("should toggle back to incomplete", async () => {
      const res = { json: vi.fn() };
      const table = makeTable();
      table.first = vi.fn().mockResolvedValueOnce({ id: "c1", is_completed: true });
      mockDb.mockImplementation(() => table);

      await toggleChecklistItem({ user: { _id: "u1", role: "admin" }, params: { id: "c1" } }, res, vi.fn());

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true, is_completed: false }));
    });

    it("should return 404 if not found", async () => {
      const res = { status: vi.fn(() => res), json: vi.fn() };
      const table = makeTable();
      table.first = vi.fn().mockResolvedValueOnce(undefined);
      mockDb.mockImplementation(() => table);

      await toggleChecklistItem({ user: { _id: "u1", role: "admin" }, params: { id: "missing" } }, res, vi.fn());

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
