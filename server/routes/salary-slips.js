import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { generateSlip, listSlips, markDownloaded } from "../controller/salarySlipController.js";

const router = Router();

router.post("/generate", authMiddleware, generateSlip);
router.get("/", authMiddleware, listSlips);
router.put("/:id/download", authMiddleware, markDownloaded);

export default router;
