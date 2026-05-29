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
    chain.then = vi.fn((cb) => cb([]));
    return chain;
  };
  const mockDb = vi.fn(() => makeTable());
  mockDb.fn = { now: vi.fn(() => "2026-01-15T00:00:00.000Z") };
  return { mockDb, makeTable };
});

vi.mock("../config/database.js", () => ({ default: mockDb }));

const { generateQrToken, qrCheckin, geoCheckin } = await import("../controller/attendanceController.js");

describe("Attendance — QR & Geo Controller", () => {
  beforeEach(() => {
    vi.stubEnv("OFFICE_LAT", "28.6139");
    vi.stubEnv("OFFICE_LNG", "77.209");
    vi.stubEnv("GEO_MAX_RADIUS", "100");
    mockDb.mockImplementation(() => makeTable());
  });

  describe("generateQrToken", () => {
    it("should generate a QR token", async () => {
      const res = { json: vi.fn() };

      await generateQrToken({ user: { _id: "u1", role: "admin" }, body: { userId: "u2" } }, res, vi.fn());

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true, token: expect.any(String), expires_at: expect.any(String),
      }));
    });

    it("should reject unauthorized roles", async () => {
      const res = { status: vi.fn(() => res), json: vi.fn() };

      await generateQrToken({ user: { _id: "u1", role: "developer" }, body: { userId: "u2" } }, res, vi.fn());

      expect(res.status).toHaveBeenCalledWith(403);
    });

    it("should fail when userId missing", async () => {
      const res = { status: vi.fn(() => res), json: vi.fn() };

      await generateQrToken({ user: { _id: "u1", role: "admin" }, body: {} }, res, vi.fn());

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe("qrCheckin", () => {
    it("should check in with valid token", async () => {
      const future = new Date(Date.now() + 60000).toISOString();
      const res = { json: vi.fn() };
      const table = makeTable();
      table.first = vi.fn().mockResolvedValueOnce({ id: "qt1", token: "valid", used: false, expires_at: future });
      mockDb.mockImplementation(() => table);

      await qrCheckin({ user: { _id: "u1", role: "developer" }, body: { qrToken: "valid" }, ip: "127.0.0.1" }, res, vi.fn());

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });

    it("should fail when qrToken missing", async () => {
      const res = { status: vi.fn(() => res), json: vi.fn() };

      await qrCheckin({ user: { _id: "u1", role: "developer" }, body: {} }, res, vi.fn());

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should fail with invalid token", async () => {
      const res = { status: vi.fn(() => res), json: vi.fn() };
      const table = makeTable();
      table.first = vi.fn().mockResolvedValueOnce(undefined);
      mockDb.mockImplementation(() => table);

      await qrCheckin({ user: { _id: "u1", role: "developer" }, body: { qrToken: "invalid" } }, res, vi.fn());

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should fail with expired token", async () => {
      const past = new Date(Date.now() - 60000).toISOString();
      const res = { status: vi.fn(() => res), json: vi.fn() };
      const table = makeTable();
      table.first = vi.fn().mockResolvedValueOnce({ id: "qt1", token: "expired", used: false, expires_at: past });
      mockDb.mockImplementation(() => table);

      await qrCheckin({ user: { _id: "u1", role: "developer" }, body: { qrToken: "expired" } }, res, vi.fn());

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe("geoCheckin", () => {
    it("should check in when within radius", async () => {
      const res = { json: vi.fn() };

      await geoCheckin({ user: { _id: "u1", role: "developer" }, body: { latitude: "28.614", longitude: "77.209" }, ip: "127.0.0.1" }, res, vi.fn());

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true, distance: expect.any(Number) }));
    });

    it("should fail when lat/lng missing", async () => {
      const res = { status: vi.fn(() => res), json: vi.fn() };

      await geoCheckin({ user: { _id: "u1", role: "developer" }, body: { latitude: "28.6" } }, res, vi.fn());

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should fail when outside radius", async () => {
      vi.stubEnv("GEO_MAX_RADIUS", "10");
      const res = { status: vi.fn(() => res), json: vi.fn() };

      await geoCheckin({ user: { _id: "u1", role: "developer" }, body: { latitude: "29.0", longitude: "77.0" }, ip: "127.0.0.1" }, res, vi.fn());

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});
