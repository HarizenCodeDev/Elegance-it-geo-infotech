import api from "../config/axios";

const chatService = {
  getMessages: (userId) => api.get("/chat", { params: { userId } }),
  sendMessage: (data) => api.post("/chat", data),
  getGroups: () => api.get("/chat/groups"),
  createGroup: (data) => api.post("/chat/groups", data),
};

export default chatService;
