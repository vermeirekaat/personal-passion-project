import { Server } from "socket.io";
// const fs = require('fs');
import fs from 'fs';

const io = new Server({
    cors: {
        origin: "http://localhost:3000",
    }, 
    options: {
        key: fs.readFileSync('./localhost.key'),
        cert: fs.readFileSync('./localhost.crt')
    }
});

let onlineUsers = [];

const addNewUser = (username, socketId) => {
    !onlineUsers.some((user) => user.username === username) &&
      onlineUsers.push({ username, socketId });
};

const addComputer = (username, socketId, code) => {
    !onlineUsers.some((user) => user.username === username) &&
      onlineUsers.push({ username, socketId, code });
};

const getGameCode = (username, code) => {
    const user = onlineUsers.findIndex((user) => user.username === username);
    onlineUsers[user].code = code;
}

const removeUser = (socketId) => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getOneUser = (socketId) => {
    return onlineUsers.find((user) => user.username === username);
}

io.on("connection", (socket) => {
    console.log(`new connection ${socket.id}`);

    socket.on("newUser", (username) => {
        addNewUser(username, socket.id);
        
        if (username === '') {
           addNewUser("computer", socket.id);
        }
    });
    socket.on("initialComputer", (username, code) => {
        addComputer(username, socket.id, code);
    })

    socket.on("insertCode", (username, code) => {
        getGameCode(username, code);
        console.log(onlineUsers);
    })

    socket.on("disconnect", () => {
        removeUser(socket.id);
        console.log(onlineUsers);
    })
});

io.listen(5000);