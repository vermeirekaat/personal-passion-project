const fs = require('fs');
const five = require("johnny-five");
const express = require('express');
const path = require("path");
const app = express();
const server = require('http').Server(app);
const port = process.env.PORT || 5000;
const board = new five.Board();

const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:3005", 
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

let firstMorse; 
let secondMorse; 

board.on("ready", () => {
    const led = new five.Led(10);
    led.blink(500);

    const morse = {
        first: { pin: 2, value: "."},
        // second: { pin: 6, value: "-"},
    }; 

    Object.keys(morse).forEach((key) => {
        const pin = morse[key].pin; 

        const button = new five.Button(pin);

        board.repl.inject({
            button: button
        });

        button.on("press", () => {
            console.log(`${pin} pressed`);
        });
    })

    /*var directions = {
    up: { pin: 2, value: null },
    right: { pin: 3, value: null },
    left: { pin: 4, value: null },
    down: { pin: 5, value: null },
  };

  Object.keys(directions).forEach(function(key) {
    var pin = directions[key].pin;

    this.pinMode(pin, five.Pin.INPUT);
    this.digitalRead(pin, function(data) {
      // Catpure the initial pin value
      if (directions[key].value === null) {
        directions[key].value = data;
      }

      // Something changed
      if (directions[key].value !== data) {
        console.log(pin, key);
      }

      directions[key].value = data;*/

    // firstMorse = new five.Button(2); 
    // // secondMorse = new five.Button(6);

    // firstMorse.on("hold", () => {
    //     console.log("on hold")
    // });
    // firstMorse.on("press", () => {
    //     console.log("up");
    // });
    // firstMorse.on("release", () => {
    //     // console.log("pressed");
    // }); 
})

const addNewUser = (socketId) => {
    let username = players[amount];
    amount++;
    // Check on Arduino which player it is
    if (username === undefined) {
        amount = 0;
        username = players[amount];
    }
    !onlineUsers.some((user) => user.username === username) &&
      onlineUsers.push({ username, socketId, currentStep: 0, startGame: false });
};

const startLevel = () => {
    if (isRoute === true) {
        // generateRoute();
        emitMessageCaptain("direction");
    } else {
        emitMessageCaptain("obstacle");
    }
};

const generateMessage = (type) => {
    if (type === "direction") {
        for (let i = 0; i < 5; i++) {
            route.push(getRandomIndex(directions));
        };
        return route;
    } else if (type === "obstacle") {
        warning = shuffleArray(obstacles);
        return warning;
    } else if (type === "options") {
        options.push(validateAnswer);
        for (let i = 0; i < 2; i++) {
            options.push(getRandomIndex(warning));
        };
        let optionsShuffle = shuffleArray(options);
        return optionsShuffle;
    }
}

const emitMessageCaptain = (type) => {
    const captain = getUserByUsername("captain");

    const array = generateMessage(type);

    io.to(captain.socketId).emit(type, array[0].word);
    validateAnswer = array[0];
    array.shift();

    if (array.length <= 0) {
        levelDone[array] = true
        console.log(`no more ${type}`);
    };

    emitMessageSailor(type);
};

const emitMessageSailor = (type) => {
    const sailor = getUserByUsername("sailor");

    if (type === "direction") {
        io.to(sailor.socketId).emit("message", "wait for message");
    } else if (type === "obstacle") {
        options = generateMessage("options");

        const findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) !== index);
        if (findDuplicates(options).length > 0) {
            options = [];
            options = generateMessage("options");    
        }
        io.to(sailor.socketId).emit("options", shuffleArray(options));
    }
    checkLevel();
}; 

const emitResult = (answer) => {
    if (answer === validateAnswer.word) {
        io.emit("result", "success");
        setTimeout(() => {
            isRoute = !isRoute;   
            if (nextLevel === false) {
                startLevel();
                io.emit("result", "");
            } else {
                route = [];
                warning = [];
                options = [];
            }
        }, 3000)
    } else {
        io.emit("result", "fail")
    }
};

const checkMorseInput = (socket, input) => {
    let correctInput;
    if (validateAnswer !== undefined) {
        correctInput = validateAnswer.morse;

        if (input.join("") === correctInput) {
            io.to(socket.id).emit("result", "correct");
        }
    }
};

const checkLevel = () => {
    if (levelDone.obstacles === true) {
        io.emit("result", "next level");
        nextLevel = true;
    } else {
        nextLevel = false
    }
};

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

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
};

io.on("connection", (socket) => {
    // console.log(`new connection ${socket.id}`);

    socket.on("newUser", (username) => {
        addNewUser(username, socket.id);
        io.to(socket.id).emit("onlineUsers", onlineUsers);

        if (onlineUsers.length === 2) {
            startLevel();
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
        emitResult(direction);
    });

    socket.on("inputAnswer", (answer) => {
        emitResult(answer);
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