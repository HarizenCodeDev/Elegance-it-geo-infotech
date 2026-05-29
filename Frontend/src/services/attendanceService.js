import api from "../config/axios";

const attendanceService = {
  getAll: (params = {}) => api.get("/attendance", { params }),
  getMyAttendance: (params = {}) => api.get("/attendance/my", { params }),
  create: (data) => api.post("/attendance", data),
  exportUrl: "/auth/export/attendance",
};

export default attendanceService;
