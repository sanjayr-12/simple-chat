const socket = io();

function getUrlname(name) {
  const urlPara = new URLSearchParams(window.location.search);
  return urlPara.get(name);
}

const roomName = getUrlname("room");
if (roomName) {
  socket.emit("join room", { roomName });
} else {
  console.log("room is not valid");
}

const form = document.getElementById("form");
const input = document.getElementById("input");
const messages = document.getElementById("messages");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value) {
    socket.emit("message", { roomName, message: input.value });
    input.value = "";
  }
});

socket.on("message", ({ message }) => {
  if (!message) {
    alert("room is not valid");
  } else {
    const item = document.createElement("li");
    console.log(message);
    item.textContent = message;
    messages.appendChild(item);
  }
});

// Connection state recovery
const disconnectBtn = document.getElementById("disconnect-btn");

disconnectBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (socket.connected) {
    disconnectBtn.innerText = "Connect";
    socket.disconnect();
  } else {
    disconnectBtn.innerText = "Disconnect";
    socket.connect();
  }
});
