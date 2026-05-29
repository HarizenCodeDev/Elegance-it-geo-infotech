import api from "../config/axios";

const salarySlipService = {
  generate: (payrollId) => api.post("/salary-slips/generate", { payrollId }),
  getAll: (params = {}) => api.get("/salary-slips", { params }),
  markDownloaded: (id) => api.put(`/salary-slips/${id}/download`),
};

export default salarySlipService;
