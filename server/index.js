const fs = require('fs');
const express = require('express');
const path = require("path");
const app = express();
const server = require('http').Server(app);
const port = process.env.PORT || 5000;

const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:3004", 
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

let route = [];
let warning = [];
let options = [];
let isRoute = true;
let levelDone = {
    "route": false,
    "obstacles": false,
};
let nextLevel;

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

const checkMorseInput = (socket, input) => {
    let correctInput;
    if (validateAnswer !== undefined) {
        correctInput = validateAnswer.morse;

        if (input.join("") === correctInput) {
            io.to(socket.id).emit("message", "correct");
        } else {
            io.to(socket.id).emit("message", "try again");
        }
    }
}

const startLevel = () => {
    warning = [];
    options = [];
    if (isRoute === true) {
        generateRoute();
    } else {
        generateObstacles();
    }
}; 

const checkLevel = () => {
    if (levelDone.obstacles === true) {
        io.emit("message", "next level");
        nextLevel = true;
    } else {
        nextLevel = false
    }
}

const generateRoute = () => {
    for (let i = 0; i < 5; i++) {
        route.push(getRandomIndex(directions));
    };
    emitRoute();
};

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

const generateObstacles = () => {
    warning = shuffleArray(obstacles);

    const captain = getUserByUsername("captain");
    io.to(captain.socketId).emit("obstacle", warning[0].word);
    validateAnswer = warning[0];
    warning.shift();

    if (warning.length <= 0) {
        levelDone.obstacles = true
        console.log("no more warnings");
        return;
    };

    const sailor = getUserByUsername("sailor");
    options.push(validateAnswer);
    for (let i = 0; i < 2; i++) {
        options.push(getRandomIndex(warning));
    };
    let optionsShuffle = shuffleArray(options);
    io.to(sailor.socketId).emit("options", shuffleArray(optionsShuffle));

    checkLevel();
}

const emitRoute = () => {
    const captain = getUserByUsername("captain");
    io.to(captain.socketId).emit("direction", route[0].word);
    validateAnswer = route[0];
    route.shift();

    if (route.length <= 0) {
        levelDone.route = true
        console.log("no more directions");
    };

    const sailor = getUserByUsername("sailor");
    io.to(sailor.socketId).emit("message", "wait for message");

    checkLevel();
}

const getOneUser = (socketId) => {
    return onlineUsers.find((user) => user.socketId === socketId);
};

const getUserByUsername = (username) => {
    return onlineUsers.find((user) => user.username === username);
}

const getOtherUser = (socketId) => {
    return onlineUsers.find((user) => user.socketId !== socketId);
};

const getRandomIndex = (array) => {
    let copy = array.slice(0);
    if (copy.length < 1) {
        copy = array.slice(0);
    }
    const index = Math.floor(Math.random() * copy.length);
    const item = copy[index];
    copy.splice(index, 1);

    return item;
};

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
            startLevel();
        } else {
            io.to(socket.id).emit("message", "wait for other player");
        }
    });

    socket.on("morseInput", (input) => {
        checkMorseInput(socket, input);
        if (onlineUsers.length > 1) {
            const otherSocket = getOtherUser(socket.id);
            io.to(otherSocket.socketId).emit("inputMorse", input);
        }
    });

    socket.on("inputDirection", (direction) => {
        if (direction === validateAnswer.word) {
            io.emit("result", "success");
            setTimeout(() => {
                isRoute = !isRoute;
                if (nextLevel === false) {
                    startLevel();
                } else {
                    options = [];
                    warning = [];
                    route = [];
                }
            }, 5000);
        } else {
            io.emit("result", "fail")
        }
    });

    socket.on("inputAnswer", (answer) => {
        if (answer === validateAnswer.word) {
            io.emit("result", "success");
            setTimeout(() => {
                isRoute = !isRoute;   
                if (nextLevel === false) {
                    startLevel();
                } else {
                    options = [];
                    warning = [];
                    route = [];
                }
            }, 5000)
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