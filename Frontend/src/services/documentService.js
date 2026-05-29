import api from "../config/axios.js";

export const documentService = {
  getFolders: (parentId) => {
    const params = {};
    if (parentId === null) params.parent_id = "null";
    else if (parentId) params.parent_id = parentId;
    return api.get("/folders", { params });
  },

  getFolderTree: () => api.get("/folders/tree"),

  createFolder: (name, parentId) =>
    api.post("/folders", { name, parent_id: parentId || null }),

  renameFolder: (id, name) =>
    api.put(`/folders/${id}`, { name }),

  deleteFolder: (id) => api.delete(`/folders/${id}`),

  getDocuments: (folderId) => {
    const params = {};
    if (folderId === null) params.folder_id = "null";
    else if (folderId) params.folder_id = folderId;
    return api.get("/documents", { params });
  },

  uploadDocument: (formData) =>
    api.post("/documents", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  deleteDocument: (id) => api.delete(`/documents/${id}`),
};
