import express from "express";
import authMiddleware from "../middleware/auth.js";
import { getMessages, sendMessage, createGroup, listGroups, deleteGroup } from "../controller/chatController.js";
import { validate, sanitizeInput } from "../middleware/validator.js";
import multer from "multer";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/") || 
        file.mimetype === "application/pdf" ||
        file.mimetype.includes("word") ||
        file.mimetype === "text/plain") {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"), false);
    }
  }
});

const sendMessageSchema = {
  contactId: { required: true },
  text: { required: true, minLength: 1, maxLength: 5000 },
};

const createGroupSchema = {
  name: { required: true, minLength: 2, maxLength: 50 },
};

router.use(authMiddleware);

router.get("/groups", listGroups);
router.post("/groups", sanitizeInput, validate(createGroupSchema), createGroup);
router.delete("/groups/:id", deleteGroup);

router.get("/", getMessages);
router.post("/", upload.single("file"), sendMessage);

export default router;
