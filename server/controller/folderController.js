import db from "../config/database.js";
import { logActivity } from "../controller/activityLogController.js";

const getFolders = async (req, res, next) => {
  try {
    const { parent_id } = req.query;
    const userId = req.user.id;

    let query = db("folders")
      .where("user_id", userId)
      .orderBy("name", "asc");

    if (parent_id === "null" || parent_id === "") {
      query = query.whereNull("parent_id");
    } else if (parent_id) {
      query = query.where("parent_id", parent_id);
    }

    const folders = await query;

    res.json({ success: true, folders });
  } catch (error) {
    next(error);
  }
};

const getFolderTree = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const allFolders = await db("folders")
      .where("user_id", userId)
      .orderBy("name", "asc");

    const buildTree = (parentId = null) =>
      allFolders
        .filter((f) => {
          if (parentId === null) return f.parent_id === null;
          return f.parent_id === parentId;
        })
        .map((f) => ({
          ...f,
          children: buildTree(f.id),
        }));

    const tree = buildTree(null);

    res.json({ success: true, tree });
  } catch (error) {
    next(error);
  }
};

const createFolder = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, parent_id } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: "Folder name is required" });
    }

    if (parent_id) {
      const parent = await db("folders").where("id", parent_id).where("user_id", userId).first();
      if (!parent) {
        return res.status(404).json({ success: false, error: "Parent folder not found" });
      }
    }

    const [folder] = await db("folders")
      .insert({
        name: name.trim(),
        parent_id: parent_id || null,
        user_id: userId,
      })
      .returning("*");

    logActivity(userId, "create", "document", folder.id, { name: folder.name });

    res.status(201).json({ success: true, folder });
  } catch (error) {
    next(error);
  }
};

const renameFolder = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: "Folder name is required" });
    }

    const folder = await db("folders").where("id", id).where("user_id", userId).first();
    if (!folder) {
      return res.status(404).json({ success: false, error: "Folder not found" });
    }

    const [updated] = await db("folders")
      .where("id", id)
      .update({ name: name.trim(), updated_at: db.fn.now() })
      .returning("*");

    logActivity(userId, "rename", "document", id, { name: updated.name });

    res.json({ success: true, folder: updated });
  } catch (error) {
    next(error);
  }
};

const deleteFolder = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const folder = await db("folders").where("id", id).where("user_id", userId).first();
    if (!folder) {
      return res.status(404).json({ success: false, error: "Folder not found" });
    }

    const childFolders = await db("folders").where("parent_id", id);
    if (childFolders.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Folder is not empty. Delete subfolders first or move them.",
      });
    }

    const docsInFolder = await db("documents").where("folder_id", id);
    if (docsInFolder.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Folder contains documents. Remove them first or move them.",
      });
    }

    await db("folders").where("id", id).del();

    logActivity(userId, "delete", "document", id, { name: folder.name });

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

export { getFolders, getFolderTree, createFolder, renameFolder, deleteFolder };
