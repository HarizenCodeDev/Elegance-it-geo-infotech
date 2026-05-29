import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { submitResignation, listResignations, updateResignationStatus } from "../controller/resignationController.js";

const router = Router();

router.post("/", authMiddleware, submitResignation);
router.get("/", authMiddleware, listResignations);
router.put("/:id/status", authMiddleware, updateResignationStatus);

export default router;
