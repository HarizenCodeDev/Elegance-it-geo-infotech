import api from "../config/axios";

const resignationService = {
  submit: (data) => api.post("/resignations", data),
  getAll: (params = {}) => api.get("/resignations", { params }),
  updateStatus: (id, status, adminNotes) => api.put(`/resignations/${id}/status`, { status, adminNotes }),
};

export default resignationService;
