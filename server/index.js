const fs = require('fs');
const express = require('express');
const path = require("path");
const app = express();
const server = require('http').Server(app);
const port = process.env.PORT || 5000;

const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:3003", 
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

let saveSteps = [];

const addNewUser = (socketId) => {
    let username = players[amount];
    amount++;

    if (username === undefined) {
        amount = 0;
        username = players[amount];
    }
    !onlineUsers.some((user) => user.username === username) &&
      onlineUsers.push({ username, socketId });
};

const checkStepsOther = (socketId) => {
    // const indexOtherUser = getOtherUser(socketId);
    const indexUser = saveSteps.find((socket) => socket.socketId !== socketId); 
    const otherSocket = getOtherUser(socketId);
    console.log(otherSocket);
    // console.log(indexUser);

    if (indexUser.currentStep < 4) {
        io.to(socketId).emit("stepsMessage", "wait for other user");
    } else if (indexUser.currentStep === 4) {
        io.to(otherSocket.socketId).emit("stepsMessage", "ready to play");
    }
}

const saveCurrentStep = (currentStep, socketId) => {
    const index = saveSteps.findIndex((socket) => socket.socketId === socketId); 
    const indexUser = onlineUsers.findIndex((user) => user.socketId === socketId);
    let username;
    if (onlineUsers.length > 0) {
        username = onlineUsers[indexUser].username;
    }
    
    if (index === -1) {
        saveSteps.push({currentStep, username, socketId});
    } else {
        saveSteps[index].currentStep = currentStep;
    }

    if (currentStep === 4) {
        checkStepsOther(socketId);
    }
};

// const getOneUser = (username) => {
//     return onlineUsers.find((user) => user.username === username);
// }

const getOtherUser = (socketId) => {
    return onlineUsers.find((user) => user.socketId !== socketId);
}

io.on("connection", (socket) => {
    // console.log(`new connection ${socket.id}`);

    socket.on("newUser", (username) => {
        addNewUser(username, socket.id);
        // console.log(onlineUsers);
        io.to(socket.id).emit("onlineUsers", onlineUsers);
    });

    socket.on("currentStep", (step) => {
        saveCurrentStep(step, socket.id);
        // console.log(saveSteps);
    })

    socket.on("morseInput", (input) => {
        if (onlineUsers.length > 1) {
            const otherSocket = getOtherUser(socket.id);
            // console.log(input);
            io.to(otherSocket.socketId).emit("inputMorse", input);
        }
    })

    socket.on("disconnect", () => {
        onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
        saveSteps = saveSteps.filter((user) => user.socketId !== socket.id);
    });
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