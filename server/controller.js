const player = require('play-sound')();

const sounds = {
    correct: "./audio/correct.mp3",
    failShort: "./audio/fail-short.mp3",
    failLong: "./audio/fail-long.mp3",
    finish: "./audio/finish.mp3", 
    long: "./audio/long.mp3",
    short: "./audio/short.mp3",
    start: "./audio/start.mp3",
    success: "./audio/success.mp3",
}

module.exports = {
    getRandomIndex: function (array) {
        let copy = array.slice(0);
        if (copy.length < 1) {
            copy = array.slice(0);
        }
        const index = Math.floor(Math.random() * copy.length);
        const item = copy[index];
        copy.splice(index, 1);
    
        return item;
    }, 
    shuffleArray: function (array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }, 
    findDuplicates: function (array) {
        let result = false; 
        result = array.some((element, index) => {
            return array.indexOf(element) !== index
        }); 
    
        if (result) {
            return true;
        } else {
            return;
        }
    }, 
    getRandomIndexEx: function (array, ex) {
        const randomNumber = Math.floor(Math.random()*array.length); 
        if (randomNumber !== ex) {
            return array[randomNumber]; 
        } else {
            return false;
        }
    },
    checkIdentical: function (array) {
        for (let i = 0; i < array.length - 1; i++){
            if (array[i] !== array[i+1]){
                return false;            
            };
        };   
    },
    playAudio: function (audio) {
        const play = player.play(sounds[audio], function(err){
            if (err && !err.killed) throw err
        });

        setTimeout(() => {
            play.kill();
        }, 50000);
        // play.kill()
    }
};