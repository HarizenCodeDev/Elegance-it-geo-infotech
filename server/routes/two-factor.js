import { Router } from "express";
import {
  setup2FA,
  verifyAndEnable2FA,
  disable2FA,
  verify2FALogin,
  get2FAStatus,
} from "../utils/twoFactor.js";
import authMiddleware from "../middleware/auth.js";

const router = Router();

router.get("/status", authMiddleware, get2FAStatus);
router.post("/setup", authMiddleware, setup2FA);
router.post("/verify", authMiddleware, verifyAndEnable2FA);
router.post("/disable", authMiddleware, disable2FA);
router.post("/verify-login", verify2FALogin);

export default router;
