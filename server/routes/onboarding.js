import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import {
  createTask, listTasks, updateTaskStatus, deleteTask,
  createChecklistItem, listChecklist, toggleChecklistItem,
} from "../controller/onboardingController.js";

const router = Router();

router.post("/tasks", authMiddleware, createTask);
router.get("/tasks", authMiddleware, listTasks);
router.put("/tasks/:id/status", authMiddleware, updateTaskStatus);
router.delete("/tasks/:id", authMiddleware, deleteTask);

router.post("/checklist", authMiddleware, createChecklistItem);
router.get("/checklist", authMiddleware, listChecklist);
router.put("/checklist/:id/toggle", authMiddleware, toggleChecklistItem);

export default router;
