import { createServer } from "http";
import { Server } from "socket.io";

const PORT = 4000;

// Create HTTP server (Socket.IO needs an HTTP server)
const httpServer = createServer();

// Create Socket.IO server
const io = new Server(httpServer, {
  cors: {
    origin: "*", // allow all origins (for dev)
  },
});

// Handle connection
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Join a room
  socket.on("joinRoom", (roomId: string) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  // Listen for code changes
  socket.on("codeChange", (data: { roomId: string; code: string }) => {
    // Broadcast to all other clients in the same room
    socket.to(data.roomId).emit("receiveCode", data.code);
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on http://localhost:${PORT}`);
});
// To run this server, use the command: npm run dev:ws(already set this in package.json)