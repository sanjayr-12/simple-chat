const express = require("express");
const app = express();
const env = require("dotenv");
const path = require("path");
const { Server } = require("socket.io");
const { createServer } = require("node:http");
const server = createServer(app);
env.config();
const port = process.env.PORT;
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const io = new Server(server, {
  connectionStateRecovery: {},
});

const rooms = [];

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/create", (req, res) => {
  const roomName = req.body.roomName;
  if (rooms.includes(roomName)) {
    res.send("room already exits");
  } else if (roomName) {
    rooms.push(roomName);
    res.redirect(`/chat.html?room=${roomName}`);
  } else {
    res.redirect("/createRoom.html");
  }
});

app.post("/joinRoom", (req, res) => {
  const roomName = req.body.Join;
  if (rooms.includes(roomName)) {
    res.redirect(`/chat.html?room=${roomName}`);
  } else {
    res.send("enter the valid room");
  }
});

io.on("connection", (socket) => {
  socket.on("join room", ({ roomName }) => {
    if (rooms.includes(roomName)) {
      socket.join(roomName);
    }
  });

  socket.on("message", ({ roomName, message }) => {
    // console.log(rooms);
    // console.log(roomName);
    if (rooms.includes(roomName)) {
      io.to(roomName).emit("message", { message });
      //   console.log(message);
    } else {
      socket.emit("message", { message: false });
    }
  });
});

server.listen(port, () => {
  console.log(`server started ${port}`);
});
