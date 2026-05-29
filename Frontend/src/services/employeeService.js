import api from "../config/axios";

const employeeService = {
  getAll: (params = {}) => api.get("/employees", { params }),
  getById: (id) => api.get(`/employees/${id}`),
  create: (data) => api.post("/employees", data),
  update: (id, data) => api.put(`/employees/${id}`, data),
  delete: (id) => api.delete(`/employees/${id}`),
  updateAttendance: (id, status) => api.put(`/employees/${id}/attendance`, { status }),
};

export default employeeService;
