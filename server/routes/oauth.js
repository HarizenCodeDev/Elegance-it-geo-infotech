import { Router } from "express";
import { initOAuth, oauthCallback, googleAuth, githubAuth } from "../utils/oauth.js";

const router = Router();

initOAuth();

router.get("/google", googleAuth);
router.get("/github", githubAuth);
router.get("/:provider/callback", oauthCallback);

export default router;
