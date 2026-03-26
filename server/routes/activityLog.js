import express from "express";
import authMiddleware from "../middleware/auth.js";
import { getActivityLogs } from "../controller/activityLogController.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getActivityLogs);

export default router;
