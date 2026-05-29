import api from "../config/axios";

const holidayService = {
  getAll: (params = {}) => api.get("/holidays", { params }),
  create: (data) => api.post("/holidays", data),
  delete: (id) => api.delete(`/holidays/${id}`),
  autoPopulate: (years = 2) => api.post(`/holidays/auto-populate?years=${years}`),
};

export default holidayService;
