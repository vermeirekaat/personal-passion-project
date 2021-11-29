const fs = require('fs');
const express = require('express');
const path = require("path");
const app = express();
const server = require('http').Server(app);
const port = process.env.PORT || 5000;

const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:3001", 
        // origin: "http://192.168.0.252:3000",
        methods: ["GET", "POST"],
    }, 
    options: {
        key: fs.readFileSync('./localhost.key'),
        cert: fs.readFileSync('./localhost.crt')
     }
});

let onlineUsers = [];
const players = ["captain", "sailor"];
let amount = 0;

const addNewUser = (socketId) => {
    let username = players[amount];
    amount++;

    if (username === undefined) {
        amount = 0;
        username = players[amount];
    }
    !onlineUsers.some((user) => user.socketId === socketId) &&
      onlineUsers.push({ username, socketId });
};

const removeUser = (socketId) => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

// const getOneUser = (username) => {
//     return onlineUsers.find((user) => user.username === username);
// }

io.on("connection", (socket) => {
    // console.log(`new connection ${socket.id}`);

    socket.on("newUser", (username) => {
        addNewUser(username, socket.id);
        console.log(onlineUsers);
        io.to(socket.id).emit("onlineUsers", onlineUsers);
    });

    socket.on("morseInput", (input) => {
        if (onlineUsers.length > 1) {
            const otherSocket = onlineUsers.find((user) => user.socketId !== socket.id);
            console.log(input);
            io.to(otherSocket.socketId).emit("inputMorse", input);
        }
    })

    socket.on("disconnect", () => {
        removeUser(socket.id);
    });

    
    // server.listen(port, () => {
    //     console.log(`App listening on port ${port}`);
    // })
});

// add middlewares
app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.static("public"));

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});
server.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
// io.listen(port);