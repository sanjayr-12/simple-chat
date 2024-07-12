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

const io = new Server(server, {
    connectionStateRecovery:{} 
});

app.get("/", (req, res) => {
  res.send(path.join(__dirname, "public", "index.html"));
});

io.on("connection", (socket) => {
    socket.on('message', (msg) => {
        io.emit('message',msg)  //emit to all the connected sockets
    })
});

server.listen(port, () => {
  console.log(`server started ${port}`);
});
