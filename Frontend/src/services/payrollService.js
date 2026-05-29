import api from "../config/axios";

const payrollService = {
  process: (data) => api.post("/payroll", data),
  getAll: (params = {}) => api.get("/payroll", { params }),
  getById: (id) => api.get(`/payroll/${id}`),
  delete: (id) => api.delete(`/payroll/${id}`),
};

export default payrollService;
