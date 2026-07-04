const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let users = [];

io.on("connection", (socket) => {
  if (users.length >= 2) {
    socket.emit("roomFull");
    socket.disconnect();
    return;
  }

  users.push(socket.id);
  io.emit("systemMessage", `User ${users.length} joined the chat`);

  socket.on("chatMessage", (message) => {
    io.emit("chatMessage", {
      id: socket.id,
      message
    });
  });

  socket.on("disconnect", () => {
    users = users.filter((id) => id !== socket.id);
    io.emit("systemMessage", "A user left the chat");
  });
});

server.listen(3000, () => {
  console.log("Chat app running at http://localhost:3000");
});