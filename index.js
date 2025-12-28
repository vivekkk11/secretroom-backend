const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { addUserToRoom, removeUserFromRoom, getRoomSize } = require("./rooms");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});


io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on("join-room", (roomId, callback) => {
    const roomSize = getRoomSize(roomId);

    if (roomSize >= 2) {
      callback({ success: false, message: "Room is full" });
      return;
    }

    socket.join(roomId);
    addUserToRoom(roomId, socket.id);
    callback({ success: true });

    socket.on("send-message", (payload) => {

      socket.to(roomId).emit("receive-message", payload);
    });

    socket.on("disconnect", () => {
      removeUserFromRoom(roomId, socket.id);

      if (getRoomSize(roomId) === 0) {
        console.log(`Room ${roomId} deleted`);
      }
    });
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
