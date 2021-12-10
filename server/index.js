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
        "type": "direction",
    },
    {
        "word": "rechts", 
        "morse": ".-..-.-.....-...",
        "type": "direction",
    }
];

const obstacles = [
    {
        "word": "vuurtoren", 
        "morse": "...-..-..-.-.----.-..-.",
        "type": "obstacles",
    },
    {
        "word": "eiland", 
        "morse": "....-...--.-..",
        "type": "obstacles",
    },
    {
        "word": "tegenligger", 
        "morse": "-.--..-..-....--.--...-.",
        "type": "obstacles",
    },
    {
        "word": "anker", 
        "morse": ".--.-.-..-.",
        "type": "obstacles",
    },
    {
        "word": "ijsberg", 
        "morse": "...---...-.....-.--.",
        "type": "obstacles",
    },
];

let morseInput = [];
let morseSeconds = [];
let answerInput;

let route = [];
let warning = [];
let options = [];
let levelDone = false;
let arrayLevel = [];
const levels = ["text", "light", "sound"];
let levelAmount = 0;
let currentLevel;

let readyToAnswer = false;
let validateAnswer;

let led;

board.on("ready", () => {
    led = new five.Led(10);
    led.off();

    const buttonsCollection = {
        first: { pin: 2, type: "morse", value: ".", sec: 1000 },
        second: { pin: 6, type: "morse", value: "-", sec: 1500 },
        third: { pin: 9, type:"submit", value: 0 },
    }; 

    Object.keys(buttonsCollection).forEach((key) => {
        const pin = buttonsCollection[key].pin; 

        const button = new five.Button({
            pin: pin,
            custom: {
                type: buttonsCollection[key].type,
                value: buttonsCollection[key].value,
                sec: buttonsCollection[key].sec,
            }
        });

        button.on("press", () => {
            if (button.custom.type === "morse") {
                morseInput.push(button.custom.value);
                morseSeconds.push(button.custom.sec);

                checkMorseInput();

            } else if (button.custom.type === "submit") {

                if (readyToAnswer) {
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
                } else {
                    io.emit("message", {message: "wait for input", user: "sailor"});
                }
            }
        });

        button.on("hold", () => {
            if (button.custom.type === "morse") {
                morseInput = [];
                morseSeconds = [];
                checkMorseInput();
            } else if (button.custom.type === "submit") {
                emitResult(answerInput);
                button.custom.value = 0;
            }
        });
    });

    io.on('connection', (socket) => {

        addNewUser("captain", socket.id);
        io.to(socket.id).emit("onlineUsers", onlineUsers);

        if (onlineUsers.length === 2) {
            startLevel(true);
        };
    });
}); 

const addNewUser = (username, socketId) => {

    !onlineUsers.some((user) => user.socketId === socketId) &&
      onlineUsers.push({ username, socketId, currentStep: 0, startGame: true });
};

const startLevel = (start) => {
    io.emit("result", "");
    currentLevel = levels[levelAmount];

    if (start === true) {
        arrayLevel = generateArray();
    };

    const captain = getUserByUsername("captain");

    const currentTask = arrayLevel[0]; 

    if (currentTask.type === "direction") {
        io.to(captain.socketId).emit("obstacles", "");
        emitMessageCaptain(currentTask);
    } else if (currentTask.type === "obstacles") {
        io.to(captain.socketId).emit("direction", "");
        emitMessageCaptain(currentTask);
    }; 

    arrayLevel.shift();
};

const showMorseLight = (step) => {
    const duration = morseSeconds[step]; 

    if (duration === 1000) {
        five.Led.prototype["blink"].apply(led);
    } else if (duration === 1500) {
        five.Led.prototype["pulse"].apply(led);
    };

    if (step < morseSeconds.length) {
        step++;
    } else if (step >= morseSeconds.length) {
        morseSeconds = [];
        led.off();
    } else if (morseSeconds.length === 0) {
        led.off();
    }

    board.wait(duration, () => {
        showMorseLight(step);
    });
};

const generateArray = () => {
    for (let i = 0; i < 5; i++) {
        route.push(getRandomIndex(directions));
    }; 
    const copy = [...obstacles]
    const newArray = route.concat(copy);

    return shuffleArray(newArray);
}

const generateOptions = (task) => {
    options.push(validateAnswer);
    const exNumber = obstacles.findIndex((item) => item.word === validateAnswer.word);

    for (let i = 0; i < 2; i++) {
        const newOption = getRandomIndexEx(obstacles, exNumber);
        if (newOption === false) {
            options = [];
            emitMessageSailor(task);
        } else {
            options.push(newOption);
        }
    };
    return options;
};

const emitMessageCaptain = (task) => {
    const captain = getUserByUsername("captain");

    io.to(captain.socketId).emit(task.type, task.word);
    validateAnswer = task;

    if (task.type === "direction") {
        if (route.length <= 0) {
            levelDone.route = true;
        }
    } else if (task.type === "obstacles") {
        if (warning.length <= 0) {
            levelDone.obstacles = true;
        }
    };

    emitMessageSailor(task);
};

const emitMessageSailor = (task) => {
    const sailor = getUserByUsername("sailor");

    if (task.type === "direction") {
        io.to(sailor.socketId).emit("options", ["changing direction"]);
    } else if (task.type === "obstacles") {
        options = generateOptions(task);

        findDuplicates(options, task);

        if (options.length === 3) {
            io.to(sailor.socketId).emit("options", shuffleArray(options));
        } else {
            options = generateOptions();
        }
    };
}; 

const findDuplicates = (array, task) => {
    let result = false; 
    result = array.some((element, index) => {
        return array.indexOf(element) !== index
    }); 

    if (result) {
        options = [];
        emitMessageSailor(task);
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
};

const emitResult = (answer) => {
    if (answer === validateAnswer.word) {
        io.emit("result", "success");
        options = [];
        morseInput = [];
        morseSeconds = [];
        readyToAnswer = false;
        io.emit("inputMorse", morseInput);
    } else {
        morseInput = [];
        morseSeconds = [];
        io.emit("result", "fail")
        io.emit("inputMorse", morseInput);
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
            readyToAnswer = true;

            if (currentLevel === "light" && morseSeconds.length > 0) {
                // showMorseLight(0);
            }
        }
    }; 
};

const checkLevel = () => {
    if (arrayLevel.length <= 0) {
        setTimeout(() => {
            io.emit("message", {message: "next level", user: "both"});
            io.emit("options", "");
            io.emit("obstacles", "");

            levelDone.route = false;
            levelDone.obstacles = false;
        }, 3000)
        levelAmount++;

        setTimeout(() => {
            startLevel(false);
        }, 10000)
    } else {
        setTimeout(() => {
            io.emit("result", "");
            startLevel(false);
        }, 3000);
    }
};

const getOneUser = (socketId) => {
    return onlineUsers.find((user) => user.socketId === socketId);
};

const getUserByUsername = (username) => {
    return onlineUsers.find((user) => user.username === username);
};

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
            startLevel(true);
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