import api from "../config/axios";

const leaveService = {
  getAll: (params = {}) => api.get("/leaves", { params }),
  create: (data) => api.post("/leaves", data),
  updateStatus: (id, status) => api.put(`/leaves/${id}/status`, { status }),
};

export default leaveService;
