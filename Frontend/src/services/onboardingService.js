import api from "../config/axios";

const onboardingService = {
  createTask: (data) => api.post("/onboarding/tasks", data),
  getTasks: (params = {}) => api.get("/onboarding/tasks", { params }),
  updateTaskStatus: (id, status) => api.put(`/onboarding/tasks/${id}/status`, { status }),
  deleteTask: (id) => api.delete(`/onboarding/tasks/${id}`),
  createChecklistItem: (data) => api.post("/onboarding/checklist", data),
  getChecklist: (params = {}) => api.get("/onboarding/checklist", { params }),
  toggleChecklistItem: (id) => api.put(`/onboarding/checklist/${id}/toggle`),
};

export default onboardingService;
