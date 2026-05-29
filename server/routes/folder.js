import express from "express";
import authMiddleware from "../middleware/auth.js";
import { getFolders, getFolderTree, createFolder, renameFolder, deleteFolder } from "../controller/folderController.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/tree", getFolderTree);
router.get("/", getFolders);
router.post("/", createFolder);
router.put("/:id", renameFolder);
router.delete("/:id", deleteFolder);

export default router;
