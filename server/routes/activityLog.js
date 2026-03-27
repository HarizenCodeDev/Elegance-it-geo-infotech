import express from "express";
import authMiddleware, { requireRole, ROLES } from "../middleware/auth.js";
import { getActivityLogs } from "../controller/activityLogController.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", 
  requireRole(ROLES.ROOT, ROLES.ADMIN), 
  getActivityLogs
);

export default router;
