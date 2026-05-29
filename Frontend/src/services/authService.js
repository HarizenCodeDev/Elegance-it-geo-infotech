import api from "../config/axios";

const authService = {
  login: (credentials) => api.post("/auth/login", credentials),
  logout: () => api.post("/auth/logout"),
  refresh: () => api.post("/auth/refresh"),
  getProfile: () => api.get("/auth/profile"),
  changePassword: (data) => api.put("/auth/change-password", data),
  forgotPassword: (employeeId) => api.post("/auth/forgot-password", { employee_id: employeeId }),
  resetPassword: (data) => api.post("/auth/reset-password", data),
  uploadAvatar: (formData) => api.post("/auth/avatar", formData),
  getLoginLogs: (params) => api.get("/auth/login-logs", { params }),
  getSessions: () => api.get("/auth/sessions"),
  terminateSession: (sessionId) => api.delete(`/auth/sessions/${sessionId}`),
  terminateAllSessions: () => api.delete("/auth/sessions"),
  getPasswordHistory: () => api.get("/auth/password-history"),
  getAllPasswordHistory: () => api.get("/auth/all-password-history"),
  resetUserPassword: (data) => api.post("/auth/reset-user-password", data),
};

export default authService;
