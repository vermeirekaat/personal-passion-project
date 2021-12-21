const fs = require('fs');
const five = require("johnny-five");
const express = require('express');
const path = require("path");
const app = express();
const server = require('http').Server(app);
const port = process.env.PORT || 5000;
const board = new five.Board();
const player = require('play-sound')();

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
let boardReady;

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
const levels = ["text"];
let levelAmount = 0;
let totalAmountLevels;
let currentLevel;

let readyToAnswer = false;
let validateAnswer = "";

let led;

board.on("ready", () => {
    boardReady = true;
    io.emit("boardReady", true);

    led = new five.Led(10);
    // led.blink();

    const buttonsCollection = {
        first: { pin: 2, type: "morse", value: ".", user: "captain" },
        second: { pin: 4, type: "morse", value: "-", user: "captain" },
        third: { pin: 8, type:"submit", value: 0, user: "sailor" },
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
            const currentUser = getUserByUsername(button.custom.user);
            if (currentPage === "onboarding" && currentUser.startGame === false) {
                handleStepsMessage(button.custom.user); 

            } else if (currentPage === "game") {
                if (button.custom.type === "morse") {
                    morseInput.push(button.custom.value);
                    checkMorseInput();
    
                } else if (button.custom.type === "submit") {
    
                    if (readyToAnswer) {
                        button.custom.value++;
                        if (button.custom.value === 1) {
                            if (options.length > 0) {
                                answerInput = options[0].word;
                            }
                        } else if (button.custom.value === 2) {
                            if (options.length > 0) {
                                answerInput = options[1].word;
                            }
                        } else if (button.custom.value === 3) {
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
            const currentUser = getUserByUsername(button.custom.user);
            if (currentPage === "onboarding" && currentUser.startGame === false) {
                handleSkipMessage(button.custom.user); 

            } else if (currentPage === "game") {
            if (button.custom.type === "morse") {
                morseInput = [];
                io.emit("inputMorse", "");
            } else if (button.custom.type === "submit") {
                emitResult(answerInput);
                button.custom.value = 0;
            }};
        });
    });

    const inputA = new five.Pin(14);
    const inputB = new five.Pin(15);

    let defaultValue;
        five.Pin.read(inputA, (value) => {
            defaultValue = value;
        });

        if (readyToAnswer) {
            inputA.on("low", () => {
                if (validateAnswer.type === "direction") { 
                    let currentState = inputA.value;
        
                    if (defaultValue !== currentState) {
                        if (inputB.value !== currentState) {
                            // console.log("rechts");
                            emitResult("rechts");
                        } else {
                            // console.log("links");
                            emitResult("links");
                        }
                    }; 
        
                    defaultValue = currentState;
                }
            });
        }
});

const addNewUser = (username, socketId) => {

    !onlineUsers.some((user) => user.socketId === socketId) &&
      onlineUsers.push({ username, socketId, currentStep: 1, startGame: false });
};

const handleStepsMessage = (user) => {
    const currentUser = getUserByUsername(user);
    io.to(currentUser.socketId).emit("nextStep", true);
};
const handleSkipMessage = (user) => {
    const currentUser = getUserByUsername(user);
    currentUser.startGame = true;
    io.to(currentUser.socketId).emit("skip", true);
};

const checkUsersReady = () => {
    const ready = [];
    onlineUsers.forEach((user) => {
        if (user.startGame === true) {
            ready.push(true);
        } else {
            return;
        }
    });
    if (ready.length === 2) {
       return true;
    }
};

const startLevel = (start) => {
    io.emit("result", "");
    answerInput = "";
    totalAmountLevels = levels.length;

    if (start === true) {
        player.play('./audio/start.mp3', (err) => {
            if (err) console.log(`Could not play sound: ${err}`);
        });
        currentLevel = levels[levelAmount];
        arrayLevel = generateArray();
    };

    console.log(arrayLevel.length);

    const captain = getUserByUsername("captain");

    const currentTask = arrayLevel[0]; 

    if (currentTask === undefined) {
        startLevel(true);
    }

    if (currentTask.type === "direction") {
        io.to(captain.socketId).emit("obstacles", "");
        emitMessageCaptain(currentTask);
    } else if (currentTask.type === "obstacles") {
        io.to(captain.socketId).emit("direction", "");
        emitMessageCaptain(currentTask);
    };

    arrayLevel.shift();
};

const generateArray = () => {
    for (let i = 0; i < 3; i++) {
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

    if (task === undefined) {
        startLevel(false);
    } else if (task.type === "direction") {
        io.to(sailor.socketId).emit("options", "");
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
            player.play('./audio/correct.mp3', (err) => {
                if (err) console.log(`Could not play sound: ${err}`);
            });
        }
    }; 
};

const showMorseLevel = () => {
    const sailor = getUserByUsername("sailor");
    io.emit("result", "correct");

    if (currentLevel === "text") {
        readyToAnswer = true;
        io.to(sailor.socketId).emit("inputMorse", validateAnswer.space);
    } else if (currentLevel === "light") {
        showMorseLight(validateAnswer.morse.split(""));    
    } else if (currentLevel === "sound") {
        showMorseSound(validateAnswer.morse.split(""));
    }
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
        readyToAnswer = true;
        io.to(sailor.socketId).emit("inputMorse", validateAnswer.space);
    } else {
        board.wait(1000, () => {
            showMorseLight(currentInput);
            io.to(sailor.socketId).emit("inputMorse", inputSim);
        });
    }; 
};

const showMorseSound = (currentInput) => {

    const sailor = getUserByUsername("sailor");
    const singleInput = currentInput[0];

    if (singleInput === ".") {
        player.play('./audio/short.mp3', (err) => {
            if (err) console.log(`Could not play sound: ${err}`);
        });
        inputSim.push(singleInput);
    } else if (singleInput === "-") {
        player.play('./audio/long.mp3', (err) => {
            if (err) console.log(`Could not play sound: ${err}`);
        });
        inputSim.push(singleInput);
    }
    currentInput.shift();

    if (currentInput.length <= 0) {
        readyToAnswer = true;
        io.to(sailor.socketId).emit("inputMorse", validateAnswer.space);
    } else {
        setTimeout(() => {
            showMorseSound(currentInput);
            io.to(sailor.socketId).emit("inputMorse", inputSim);
        }, 1000);
    }; 
}

const emitResult = (answer) => {
    const sailor = getUserByUsername("sailor");
    if (answer === validateAnswer.word) {
        player.play('./audio/success.mp3', (err) => {
            if (err) console.log(`Could not play sound: ${err}`);
        });
        io.emit("result", "success");
        if (answer === "links" || answer === "rechts") {
            io.to(sailor.socketId).emit("getRotation", answer);
        }
        options = []; 
        readyToAnswer = false;
    } else {
        player.play('./audio/fail-short.mp3', (err) => {
            if (err) console.log(`Could not play sound: ${err}`);
        });
        io.emit("result", "fail");
    };
    morseInput = [];
    inputSim = [];
    io.emit("inputMorse", "");
    io.emit("options", "");
    io.emit("obstacles", "");
    io.emit("direction", "");

    checkLevel();
};

const checkLevel = () => {
    if (arrayLevel.length <= 1) {
        setTimeout(() => {
            io.emit("result", "Next Level");
        }, 3000)
        levelAmount++;

        if (levelAmount === totalAmountLevels) {
            io.emit("result", "finish");
            player.play('./audio/finish.mp3', (err) => {
                if (err) console.log(`Could not play sound: ${err}`);
            });
            return;
        }

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

const addLevelToArray = (data) => {
    if (data.led === true) {
        levels.push("light");
    };
    if (data.sound === true) {
        levels.push("sound");
    };
}

const getUserByUsername = (username) => {
    return onlineUsers.find((user) => user.username === username);
};

const getOneUser = (socketId) => {
    return onlineUsers.find((user) => user.socketId === socketId);
};

const removeUser = (socketId) => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
}

io.on("connection", (socket) => {

    if (boardReady) {
        io.emit("boardReady", true);
    }

    socket.on("newPlayer", (username) => {
        addNewUser(username, socket.id);
    });

    socket.on("page", (page) => {
        currentPage = page;
    });

    socket.on("settingsChange", (data) => {
        if (onlineUsers.length > 1) {
            const sailor = getUserByUsername("sailor")
            io.to(sailor.socketId).emit("handleChange", (data));
        }
    })

    socket.on("startGame", (boolean) => {
        const user = getOneUser(socket.id);
        user.startGame = boolean;
        
        const ready = checkUsersReady();
        if (ready) {
            io.emit("navigateGame", true);
            startLevel(true);
        }
    });

    socket.on("saveLevels", (data) => {
        const user = getOneUser(socket.id);

        if (user.username === "captain") {
            addLevelToArray(data);
        }
    })

    socket.on("gameOver", (boolean) => {
        if (boolean === true) {
            setTimeout(() => {
                player.play('./audio/fail-long.mp3', (err) => {
                    if (err) console.log(`Could not play sound: ${err}`);
                });
            }, 1050)
        }
    });

    socket.on("removeUser", () => {
        removeUser(socket.id);
    })

    socket.on("disconnect", () => {
        removeUser(socket.id);
        morseInput = [];
        arrayLevel = [];
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