import express from "express";
import authMiddleware from "../middleware/auth.js";
import { getNotifications, markAsRead, markAllAsRead, deleteNotification } from "../controller/notificationController.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getNotifications);

router.put("/:id/read", markAsRead);

router.put("/read-all", markAllAsRead);

router.delete("/:id", deleteNotification);

export default router;
