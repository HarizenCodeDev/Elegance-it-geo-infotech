import db from "../config/database.js";
import { uploadFile, deleteFile } from "../utils/supabaseStorage.js";

const ALLOWED_TYPES = ["contract", "id_proof", "certificate", "other"];

const getDocuments = async (req, res, next) => {
  try {
    const userId = req.params.userId || req.user._id;
    
    if (req.params.userId && !["root", "admin", "manager"].includes(req.user.role)) {
      return res.status(403).json({ success: false, error: "Not authorized" });
    }

    const documents = await db("documents")
      .where("user_id", userId)
      .orderBy("created_at", "desc");

    res.json({
      success: true,
      documents: documents.map(d => ({
        _id: d.id,
        name: d.name,
        type: d.type,
        fileUrl: d.file_url,
        description: d.description,
        createdAt: d.created_at,
      })),
    });
  } catch (error) {
    next(error);
  }
};

const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No file uploaded" });
    }

    const userId = req.user._id;
    const { name, type = "other", description } = req.body;

    if (!ALLOWED_TYPES.includes(type)) {
      return res.status(400).json({ success: false, error: "Invalid document type" });
    }

    const fileUrl = await uploadFile(req.file, "documents");

    const [document] = await db("documents")
      .insert({
        user_id: userId,
        name: name || req.file.originalname,
        type,
        file_url: fileUrl,
        description,
      })
      .returning("*");

    res.status(201).json({
      success: true,
      document: {
        _id: document.id,
        name: document.name,
        type: document.type,
        fileUrl: document.file_url,
        description: document.description,
        createdAt: document.created_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteDocument = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const doc = await db("documents").where("id", id).first();

    if (!doc) {
      return res.status(404).json({ success: false, error: "Document not found" });
    }

    if (doc.user_id !== userId && !["root", "admin"].includes(req.user.role)) {
      return res.status(403).json({ success: false, error: "Not authorized" });
    }

    if (doc.file_url) {
      await deleteFile(doc.file_url);
    }

    await db("documents").where("id", id).del();

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

export { getDocuments, uploadDocument, deleteDocument, ALLOWED_TYPES };
