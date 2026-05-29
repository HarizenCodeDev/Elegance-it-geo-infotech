import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { processPayroll, listPayroll, getPayroll, deletePayroll } from "../controller/payrollController.js";

const router = Router();

router.post("/", authMiddleware, processPayroll);
router.get("/", authMiddleware, listPayroll);
router.get("/:id", authMiddleware, getPayroll);
router.delete("/:id", authMiddleware, deletePayroll);

export default router;
