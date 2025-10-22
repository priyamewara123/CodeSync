import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { connectDB } from "./db.js";
import { redisClient } from "./redis.js";
import { Room } from "./model/Room.js";
import app from "./app.js";

dotenv.config();
// const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});



const PORT = process.env.PORT || 4000;
connectDB();

// Socket.IO events
io.on("connection", (socket) => {
  console.log("🟢 New client connected:", socket.id);

  socket.on("join-room", async (roomId: string) => {
    socket.join(roomId);
    console.log(`📚 ${socket.id} joined room: ${roomId}`);

    // Check cached data
    const cachedCode = await redisClient.get(roomId);
    if (cachedCode) {
      socket.emit("load-code", cachedCode);
      return;
    }

    // If not cached, fetch from DB
    let room = await Room.findOne({ roomId });
    if (!room) {
      room = await Room.create({ roomId, code: "" });
    }

    socket.emit("load-code", room.code);
  });

  socket.on("code-change", async ({ roomId, code }) => {
    // Update Redis immediately
    await redisClient.set(roomId, code);

    // Broadcast to other clients
    socket.to(roomId).emit("code-change", code);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

// Periodically sync Redis → MongoDB
setInterval(async () => {
  const keys = await redisClient.keys("*");
  for (const key of keys) {
    const code = await redisClient.get(key);
    if (code) {
      await Room.findOneAndUpdate({ roomId: key }, { code }, { upsert: true });
    }
  }
  console.log("💾 Code synced from Redis → MongoDB");
}, 10000); // every 10 seconds

server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
