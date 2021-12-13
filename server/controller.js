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
            // options = [];
            // emitMessageSailor(task);
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
};