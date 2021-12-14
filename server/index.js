const fs = require('fs');
const five = require("johnny-five");
const express = require('express');
const path = require("path");
const app = express();
const server = require('http').Server(app);
const port = process.env.PORT || 5000;
const board = new five.Board();

const myFunctions = require('./controller');
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
let currentPage;

const directions = [
    {
        "word": "links", 
        "morse": ".-....-.-.-...",
        "space": ".-.. .. -. -.- ...",
        "type": "direction",
    },
    {
        "word": "rechts", 
        "morse": ".-..-.-.....-...",
        "space": ".-. . -.-. .... - ...",
        "type": "direction",
    }
];

const obstacles = [
    {
        "word": "vuurtoren", 
        "morse": "...-..-..-.-.----.-..-.",
        "space": "...- ..- ..- .-. - --- .-. . -.",
        "type": "obstacles",
    },
    {
        "word": "eiland", 
        "morse": "....-...--.-..",
        "space": ". .. .-.. .- -. -..",
        "type": "obstacles",
    },
    {
        "word": "tegenligger", 
        "morse": "-.--..-..-....--.--...-.",
        "space": "- . --. . -. .-.. .. --. --. . .-.",
        "type": "obstacles",
    },
    {
        "word": "anker", 
        "morse": ".--.-.-..-.",
        "space": ".- -. -.- . .-.",
        "type": "obstacles",
    },
    {
        "word": "ijsberg", 
        "morse": "...---...-.....-.--.",
        "space": ".. .--- ... -... . .-. --.",
        "type": "obstacles",
    },
];

let morseInput = [];
let inputSim = [];
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
        first: { pin: 2, type: "morse", value: ".", user: "captain" },
        second: { pin: 6, type: "morse", value: "-", user: "captain" },
        third: { pin: 9, type:"submit", value: 0, user:"sailor" },
    }; 

    Object.keys(buttonsCollection).forEach((key) => {
        const pin = buttonsCollection[key].pin; 

        const button = new five.Button({
            pin: pin,
            custom: {
                type: buttonsCollection[key].type,
                value: buttonsCollection[key].value,
                sec: buttonsCollection[key].sec,
                user: buttonsCollection[key].user,
            }
        });

        button.on("press", () => {
            if (currentPage === "onboarding") {
                handleStepsMessage(button.custom.user); 

            } else if (currentPage === "game") {
                if (button.custom.type === "morse") {
                    morseInput.push(button.custom.value);
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
                        io.emit("result", "wait for input");
                    }
                }
            }
        });

        button.on("hold", () => {
            if (button.custom.type === "morse") {
                morseInput = [];
                io.emit("inputMorse", "");
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
      onlineUsers.push({ username, socketId, currentStep: 1, startGame: true });
};

const checkStepsOther = (socketId) => {
    const otherSocket = getOtherUser(socketId);

    if (otherSocket.currentStep < 4) {
        io.to(socketId).emit("result", "wait for other user");
    } else if (otherSocket.currentStep === 4) {
        io.to(otherSocket.socketId).emit("result", "ready to play");
    }
}; 

const handleSteps = (user) => {
    const currentUser = getUserByUsername(user);
    const nextStep = currentUser.currentStep++;
    currentUser.currentStep = nextStep;

    io.to(currentUser.socketId).emit("message", currentUser.currentStep);

    // console.log(currentUser);

    if (user === "captain" && nextStep === 4) {
        const choosenDirection = myFunctions.getRandomIndex(directions);
        validateAnswer = choosenDirection;
        io.to(currentUser.socketId).emit("direction", choosenDirection.word);
        checkStepsOther(currentUser.socketId);
    } else if (user === "sailor" && nextStep === 4) {
        checkStepsOther(currentUser.socketId);
    }
}; 

const handleStepsMessage = (user) => {
    const currentUser = getUserByUsername(user);
    io.to(currentUser.socketId).emit("nextStep", true);
}

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

const showMorseLight = (currentInput) => {
    const sailor = getUserByUsername("sailor");
    const singleInput = currentInput[0];

    if (singleInput === ".") {
        five.Led.prototype["blink"].apply(led);
        inputSim.push(singleInput);
    } else if (singleInput === "-") {
        five.Led.prototype["pulse"].apply(led);
        inputSim.push(singleInput);
    }
    currentInput.shift();

    if (currentInput.length <= 0) {
        led.stop().off();
        io.to(sailor.socketId).emit("inputMorse", validateAnswer.space);
    } else {
        board.wait(1000, () => {
            showMorseLight(currentInput);
            io.to(sailor.socketId).emit("inputMorse", inputSim);
        });
    }; 
};

const generateArray = () => {
    for (let i = 0; i < 5; i++) {
        route.push(myFunctions.getRandomIndex(directions));
    }; 
    const copy = [...obstacles]
    const newArray = route.concat(copy);

    return myFunctions.shuffleArray(newArray);
}

const generateOptions = (task) => {
    options.push(validateAnswer);
    const exNumber = obstacles.findIndex((item) => item.word === validateAnswer.word);

    for (let i = 0; i < 2; i++) {
        const newOption = myFunctions.getRandomIndexEx(obstacles, exNumber);
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

        const duplicates = myFunctions.findDuplicates(options, task);
        if (duplicates) {
            options = [];
            emitMessageSailor(task);
        }

        if (options.length === 3) {
            io.to(sailor.socketId).emit("options", myFunctions.shuffleArray(options));
        } else {
            options = generateOptions();
        }
    };
}; 

const emitResult = (answer) => {
    const sailor = getUserByUsername("sailor");
    if (answer === validateAnswer.word) {
        io.emit("result", "success");
        options = []; 
        readyToAnswer = false;
        if (answer === "links" || answer === "rechts") {
            io.to(sailor.socketId).emit("getRotation", answer);
        }
    } else {
        io.emit("result", "fail");
    };
    morseInput = [];
    inputSim = [];
    io.emit("inputMorse", "");
    checkLevel();
};

const checkMorseInput = () => {
    let correctInput;
    const captain = getUserByUsername("captain");
    const sailor = getUserByUsername("sailor");

    if (validateAnswer !== undefined) {
        io.emit("inputMorse", morseInput);
        if (currentLevel !== "text") {
            io.to(captain.socketId).emit("inputMorse", morseInput);
            io.to(sailor.socketId).emit("inputMorse", currentLevel);
        }
        correctInput = validateAnswer.morse;

        if (morseInput.join("") === correctInput) {
            io.to(sailor.socketId).emit("inputMorse", "");
            showMorseLevel();
            readyToAnswer = true;
        }
    }; 
};

const showMorseLevel = () => {
    const sailor = getUserByUsername("sailor");
    io.emit("result", "correct");

    if (currentLevel === "text") {
        io.to(sailor.socketId).emit("inputMorse", validateAnswer.space);
    }

    if (currentLevel === "light") {
        showMorseLight(validateAnswer.morse.split(""));    
    }

}

const checkLevel = () => {
    if (arrayLevel.length <= 0) {
        setTimeout(() => {
            io.emit("result", "next level");
            io.emit("options", "");
            io.emit("obstacles", "");
        }, 3000)
        levelAmount++;

        setTimeout(() => {
            startLevel(true);
        }, 10000)
    } else {
        setTimeout(() => {
            io.emit("result", "");
            startLevel(false);
        }, 3000);
    }
};

const getUserByUsername = (username) => {
    return onlineUsers.find((user) => user.username === username);
};

const getOtherUser = (socketId) => {
    return onlineUsers.find((user) => user.socketId !== socketId);
};

io.on("connection", (socket) => {

    socket.on("newUser", () => {
        addNewUser("sailor", socket.id);
        io.to(socket.id).emit("onlineUsers", onlineUsers);

        if (onlineUsers.length === 2) {
            startLevel(true);
        };
    });

    socket.on("page", (page) => {
        currentPage = page;
    })

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