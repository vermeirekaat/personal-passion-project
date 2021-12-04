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

const directions = [
    {
        "word": "links", 
        "morse": ".-....-.-.-...",
    },
    {
        "word": "rechts", 
        "morse": ".-..-.-.....-...",
    }
];

const obstacles = [
    {
        "word": "vuurtoren", 
        "morse": "...-..-..-.-.----.-..-.",
    },
    {
        "word": "eiland", 
        "morse": "....-...--.-..",
    },
    {
        "word": "tegenligger", 
        "morse": "-.--..-..-....--.--...-.",
    },
    {
        "word": "anker", 
        "morse": ".--.-.-..-.",
    },
    {
        "word": "ijsberg", 
        "morse": "...---...-.....-.--.",
    },
];

let validateAnswer;

const addNewUser = (socketId) => {
    let username = players[amount];
    amount++;

    if (username === undefined) {
        amount = 0;
        username = players[amount];
    }
    !onlineUsers.some((user) => user.username === username) &&
      onlineUsers.push({ username, socketId, currentStep: 0, startGame: false });
};

const checkStepsOther = (socketId) => {
    const otherSocket = getOtherUser(socketId);

    if (otherSocket.currentStep < 4) {
        io.to(socketId).emit("message", "wait for other user");
    } else if (otherSocket.currentStep === 4) {
        io.to(otherSocket.socketId).emit("message", "ready to play");
    }
}; 

const getOneUser = (socketId) => {
    return onlineUsers.find((user) => user.socketId === socketId);
};

const getOtherUser = (socketId) => {
    return onlineUsers.find((user) => user.socketId !== socketId);
};

const getRandomIndex = (array) => {
    return array[Math.floor(Math.random()*array.length)];
}

io.on("connection", (socket) => {
    // console.log(`new connection ${socket.id}`);

    socket.on("newUser", (username) => {
        addNewUser(username, socket.id);
        io.to(socket.id).emit("onlineUsers", onlineUsers);
    });

    socket.on("currentStep", (step) => {
        const currentUser = getOneUser(socket.id);
        currentUser.currentStep = step;

        if (currentUser.username === "captain" && step === 4) {
            const choosenDirection = getRandomIndex(directions);
            validateAnswer = choosenDirection;
            io.to(socket.id).emit("direction", choosenDirection.word);
            checkStepsOther(socket.id);
        } else if (currentUser.username === "sailor" && step === 4) {
            checkStepsOther(socket.id);
        }
    });

    socket.on("startGame", (boolean) => {
        const currentUser = getOneUser(socket.id);
        currentUser.startGame = boolean;

        const otherUser = getOtherUser(socket.id); 
        if (currentUser.startGame && otherUser.startGame) {
            io.emit("message", "ready to play");
        } else {
            io.to(socket.id).emit("message", "wait for other player");
        }
    });

    socket.on("morseInput", (input) => {
        if (onlineUsers.length > 1) {
            const otherSocket = getOtherUser(socket.id);
            io.to(otherSocket.socketId).emit("inputMorse", input);
        }
    });

    socket.on("direction", (direction) => {
        if (direction === validateAnswer.word) {
            io.emit("result", "success");
        } else {
            io.emit("result", "fail")
        }
    });

    socket.on("disconnect", () => {
        onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
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