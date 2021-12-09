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
        // origin: "http://192.168.0.252:3005",
        methods: ["GET", "POST"],
    }, 
    options: {
        key: fs.readFileSync('./localhost.key'),
        cert: fs.readFileSync('./localhost.crt')
     }
});

let onlineUsers = [];

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

const defaultObstacles = [
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

let morseInput = [];
let answerInput;

let route = [];
let warning = [];
let options = [];
let isRoute = true;
let levelDone = {
    "route": false,
    "obstacles": false,
};
const levels = ["text", "light", "sound"];
let levelAmount = 0;
let currentLevel;

let validateAnswer;

let led;

board.on("ready", () => {
    led = new five.Led(10);

    const buttonsCollection = {
        first: { pin: 2, type: "morse", value: "." },
        second: { pin: 6, type: "morse", value: "-" },
        third: { pin: 9, type:"submit", value: 0 },
    }; 

    Object.keys(buttonsCollection).forEach((key) => {
        const pin = buttonsCollection[key].pin; 

        const button = new five.Button({
            pin: pin,
            custom: {
                type: buttonsCollection[key].type,
                value: buttonsCollection[key].value,
            }
        });

        board.repl.inject({
            button: button
        });

        button.on("press", () => {
            if (button.custom.type === "morse") {
                morseInput.push(button.custom.value);
                checkMorseInput();
            } else if (button.custom.type === "submit") {
                button.custom.value++;
                if (button.custom.value === 1) {
                    answerInput = "rechts";
                } else if (button.custom.value === 2) {
                    answerInput = "links";
                } else if (button.custom.value === 3) {
                    if (options.length > 0) {
                        answerInput = options[0].word;
                    }
                } else if (button.custom.value === 4) {
                    if (options.length > 0) {
                        answerInput = options[1].word;
                    }
                } else if (button.custom.value === 5) {
                    if (options.length > 0) {
                        answerInput = options[2].word;
                    }
                };
            }
        });

        button.on("hold", () => {
            if (button.custom.type === "morse") {
                morseInput = [];
                checkMorseInput();
            } else if (button.custom.type === "submit") {
                emitResult(answerInput);
                button.custom.value = 0;
            }
        });
    });

    io.on('connection', (socket) => {
        // console.log(socket);

        addNewUser("captain", socket.id);
        io.to(socket.id).emit("onlineUsers", onlineUsers);

        if (onlineUsers.length === 2) {
            console.log(onlineUsers);
            startLevel();
        };
    });
}); 

const addNewUser = (username, socketId) => {

    !onlineUsers.some((user) => user.socketId === socketId) &&
      onlineUsers.push({ username, socketId, currentStep: 0, startGame: true });
};

const startLevel = () => {
    io.emit("result", "");
    currentLevel = levels[levelAmount];

    if (currentLevel === "light") {
        showMorseLight();
    }

    const captain = getUserByUsername("captain");

    if (isRoute === true && levelDone.route === false) {
        io.to(captain.socketId).emit("obstacles", "");
        emitMessageCaptain("direction");
    } else {
        io.to(captain.socketId).emit("direction", "");
        emitMessageCaptain("obstacles");
    }
};

const showMorseLight = () => {
    led.blink(500);
}

const generateMessage = (type) => {
    if (type === "direction") {
        if (route.length <= 0) {
            for (let i = 0; i < 5; i++) {
                route.push(getRandomIndex(directions));
            };
        }
        return route;
    } else if (type === "obstacles") {
        warning = shuffleArray(obstacles);
        return warning;
    } else if (type === "options") {
        options.push(validateAnswer);
        const exNumber = defaultObstacles.findIndex((item) => item.word === validateAnswer.word);

        for (let i = 0; i < 2; i++) {
            const newOption = getRandomIndexEx(defaultObstacles, exNumber);

            if (newOption === false) {
                options = [];
                emitMessageSailor("obstacles");
            } else {
                options.push(newOption);
            }
        };
        return options;
    }
};

const emitMessageCaptain = (type) => {
    const captain = getUserByUsername("captain");
    console.log(type);

    const array = generateMessage(type);
    console.log(array);

    io.to(captain.socketId).emit(type, array[0].word);
    validateAnswer = array[0];
    array.shift();

    if (type === "direction") {
        if (route.length <= 0) {
            levelDone.route = true;
        }
    } else if (type === "obstacles") {
        if (warning.length <= 0) {
            levelDone.obstacles = true;
        }
    };

    emitMessageSailor(type);
};

const emitMessageSailor = (type) => {
    const sailor = getUserByUsername("sailor");

    if (type === "direction") {
        io.to(sailor.socketId).emit("options", ["wait for message"]);
    } else if (type === "obstacles") {
        options = generateMessage("options");
        findDuplicates(options);

        if  (options.length === 3) {
            io.to(sailor.socketId).emit("options", shuffleArray(options));
        }
    };
}; 

const findDuplicates = (array) => {
    let result = false; 
    result = array.some((element, index) => {
        return array.indexOf(element) !== index
    }); 

    if (result) {
        options = [];
        emitMessageSailor("obstacles");
    } else {
        return;
    }
};

const getRandomIndexEx = (array, ex) => {
    const randomNumber = Math.floor(Math.random()*array.length); 
    if (randomNumber !== ex) {
        return array[randomNumber]; 
    } else {
        return false;
    }
}

const emitResult = (answer) => {
    if (answer === validateAnswer.word) {
        io.emit("result", "success");
        options = [];
        morseInput = [];
        io.emit("inputMorse", morseInput);
    } else {
        io.emit("result", "fail")
    };
    checkLevel();
};

const checkMorseInput = () => {
    let correctInput;
    const captain = getUserByUsername("captain");
    if (validateAnswer !== undefined) {
        io.emit("inputMorse", morseInput);
        correctInput = validateAnswer.morse;

        if (morseInput.join("") === correctInput) {
            io.to(captain.socketId).emit("result", "correct");
        }
    }
};

const checkLevel = () => {
    // console.log(levelDone);
    if (levelDone.route && levelDone.obstacles) {
        setTimeout(() => {
            io.emit("result", "next level");
            io.emit("options", "");
            io.emit("obstacles", "");

            levelDone.route = false;
            levelDone.obstacles = false;
        }, 3000)
        levelAmount++;

        setTimeout(() => {
            isRoute = !isRoute;
            obstacles.push({
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
            },);
            startLevel();
        }, 10000)
    } else {
        setTimeout(() => {
            isRoute = !isRoute
            io.emit("result", "");
            startLevel();
        }, 3000);
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

    socket.on("newUser", () => {
        addNewUser("sailor", socket.id);
        io.to(socket.id).emit("onlineUsers", onlineUsers);

        if (onlineUsers.length === 2) {
            startLevel();
        };
    });

    socket.on("inputAnswer", (answer) => {
        emitResult(answer);
        morseInput = [];
    });

    socket.on("disconnect", () => {
        onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
        morseInput = [];
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