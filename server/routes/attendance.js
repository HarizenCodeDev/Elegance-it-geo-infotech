import express from "express";
import authMiddleware, { requireRole, ROLES } from "../middleware/auth.js";
import {
  createOrUpdateAttendance,
  listAttendance,
  listMyAttendance,
} from "../controller/attendanceController.js";

const router = express.Router();

router.post("/", authMiddleware, createOrUpdateAttendance);

router.get("/my", authMiddleware, listMyAttendance);

router.get("/", authMiddleware, listAttendance);

export default router;
