import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

let io = null;
const userSockets = new Map();
const socketUsers = new Map();

export const initSocketIO = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication required"));
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded._id;
      socket.userName = decoded.name;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.userName} (${socket.userId})`);
    
    userSockets.set(socket.userId, socket.id);
    socketUsers.set(socket.id, socket.userId);

    socket.join(`user:${socket.userId}`);
    socket.join("online");

    io.emit("user:online", { userId: socket.userId, userName: socket.userName });

    socket.on("chat:send", (data) => {
      io.to(`user:${data.to}`).emit("chat:receive", {
        from: socket.userId,
        fromName: socket.userName,
        text: data.text,
        timestamp: new Date().toISOString(),
      });
    });

    socket.on("chat:sendGroup", (data) => {
      socket.to(`group:${data.groupId}`).emit("chat:receiveGroup", {
        from: socket.userId,
        fromName: socket.userName,
        text: data.text,
        groupId: data.groupId,
        timestamp: new Date().toISOString(),
      });
    });

    socket.on("typing:start", (data) => {
      if (data.groupId) {
        socket.to(`group:${data.groupId}`).emit("typing:update", {
          userId: socket.userId,
          userName: socket.userName,
          groupId: data.groupId,
        });
      } else {
        io.to(`user:${data.to}`).emit("typing:update", {
          userId: socket.userId,
          userName: socket.userName,
        });
      }
    });

    socket.on("typing:stop", (data) => {
      if (data.groupId) {
        socket.to(`group:${data.groupId}`).emit("typing:stop", {
          userId: socket.userId,
          groupId: data.groupId,
        });
      } else {
        io.to(`user:${data.to}`).emit("typing:stop", {
          userId: socket.userId,
        });
      }
    });

    socket.on("message:read", (data) => {
      io.to(`user:${data.from}`).emit("message:read", {
        messageId: data.messageId,
        readBy: socket.userId,
      });
    });

    socket.on("notification:send", (data) => {
      io.to(`user:${data.userId}`).emit("notification:new", {
        id: data.id,
        title: data.title,
        message: data.message,
        type: data.type,
        timestamp: new Date().toISOString(),
      });
    });

    socket.on("join:group", (groupId) => {
      socket.join(`group:${groupId}`);
      socket.to(`group:${groupId}`).emit("user:joined", {
        userId: socket.userId,
        userName: socket.userName,
        groupId,
      });
    });

    socket.on("leave:group", (groupId) => {
      socket.leave(`group:${groupId}`);
      socket.to(`group:${groupId}`).emit("user:left", {
        userId: socket.userId,
        userName: socket.userName,
        groupId,
      });
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.userName}`);
      userSockets.delete(socket.userId);
      socketUsers.delete(socket.id);
      io.emit("user:offline", { userId: socket.userId });
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};

export const sendToUser = (userId, event, data) => {
  if (io) {
    io.to(`user:${userId}`).emit(event, data);
  }
};

export const sendToGroup = (groupId, event, data) => {
  if (io) {
    io.to(`group:${groupId}`).emit(event, data);
  }
};

export const broadcast = (event, data) => {
  if (io) {
    io.emit(event, data);
  }
};

export const isUserOnline = (userId) => {
  return userSockets.has(userId);
};

export const getOnlineUsers = () => {
  return Array.from(userSockets.keys());
};

export default {
  initSocketIO,
  getIO,
  sendToUser,
  sendToGroup,
  broadcast,
  isUserOnline,
  getOnlineUsers,
};
