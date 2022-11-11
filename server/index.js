const express = require('express');
const app = express();
const ip = require('ip');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

let localhost = ip.address();
console.log(localhost);

app.use(cors());

const server = http.createServer(app);

// Connecting cors to express server
const io = new Server(server, {
    handlePreflightRequest: (req, res) => {
        const headers = {
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Origin": req.headers.origin, //or the specific origin you want to give access to,
            "Access-Control-Allow-Credentials": true
        };
        res.writeHead(200, headers);
        res.end();
    },
    cors: {
        // Determining which URL will be making calls to the socket.io server
        // ReactJS app is running on PORT 3000 on a localhost server
        origin: 'http://localhost:3000',
        // Specifying the allowed request methods
        methods: ['GET', 'POST'],
        credentials: true
    }
});

// Listening for the connection event. It detects if someone is connected to the socket.io server
io.on('connection', (socket) => {
    console.log(`user connected: ${socket.id}`);

    // Receives roomID from the frontend via socket.emit function
    socket.on('join_room', (room) => {
        socket.join(room);
        console.log(`UserID: ${socket.id} joined room ${room}`);
    })

    socket.on('send_message', (data) => {
        socket.to(data.room).emit('receive_message', data);
    });

    socket.on('disconnect', () => {
        console.log(`user disconnected: ${socket.id}`);
    });
});

server.listen(3001, () => {
    console.log('SERVER RUNNING');
})