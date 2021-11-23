const fs = require('fs');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const port = process.env.PORT || 5000;

const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:3000", 
        // origin: "http://192.168.0.252:3000",
        methods: ["GET", "POST"],
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
};

const checkGameCode = (code) => {
    const computer = onlineUsers.find((id) => id.username === 'computer');
    if (computer.code === code) {
        return true;
    } else {
        return false
    }
}

const removeUser = (socketId) => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getOneUser = (username) => {
    return onlineUsers.find((user) => user.username === username);
}

io.on("connection", (socket) => {
    console.log(`new connection ${socket.id}`);

    socket.on("newUser", (username) => {
        addNewUser(username, socket.id);
    });
    socket.on("initialComputer", (username, code) => {
        addComputer(username, socket.id, code);
    });
    socket.on("insertName", (input) => {
        const computer = onlineUsers.find((id) => id.username === 'computer');
        io.to(computer.socketId).emit("inputPlayer", {
            input,
            socket: socket.id,
        });
    });

    socket.on("insertCode", (username, code) => {
        getGameCode(username, code);
    });
    socket.on("sendConfirmation", ({ player, code }) => {
        const playerName = getOneUser(player);
        const correct = checkGameCode(code);
        io.emit("codeConfirmation", {
            playerName, 
            correct,
        });
        console.log(onlineUsers);
    })

    socket.on("disconnect", () => {
        removeUser(socket.id);
    });

    // app.use(express.static('public')); 
    // server.listen(port, () => {
    //     console.log(`App listening on port ${port}`);
    // })
});

io.listen(port);