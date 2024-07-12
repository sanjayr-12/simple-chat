const socket = io();

const form = document.getElementById('form')
const input = document.getElementById('input')

const message  = document.getElementById('messages')

form.addEventListener('submit', (e) => {
    e.preventDefault()
    if (input.value) {
        socket.emit('message', input.value)
        input.value = '';
    }
})


socket.on('message', (msg) => {
    const item = document.createElement('li')
    item.textContent = msg
    message.appendChild(item)
})


//connection state recovery
//temporarily store all the events that are sent by the server and will restore when the client reconnects

const disconnectBtn = document.getElementById('disconnect-btn')

disconnectBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (socket.connected) {
        disconnectBtn.innerText = 'Connect'
        socket.disconnect()
    } else {
        disconnectBtn.innerText = 'Disconnect'
        socket.connect()
    }
})