import express from "express";
import authMiddleware from "../middleware/auth.js";
import { getHolidays, createHoliday, deleteHoliday, getUpcomingHolidays } from "../controller/holidayController.js";

const router = express.Router();

router.get("/", authMiddleware, getHolidays);

router.get("/upcoming", authMiddleware, getUpcomingHolidays);

router.post("/", authMiddleware, createHoliday);

router.delete("/:id", authMiddleware, deleteHoliday);

export default router;
