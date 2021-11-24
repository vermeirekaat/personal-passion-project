import React from "react";

const Welcome = ({ socket }) => {

    const players = ["captain", "sailor"]; 
    let amount = 0;

    const handleClickButton = () => {
        console.log(socket.id);

        socket?.emit("newUser", players[amount]);
        amount++;
    }

    return(
        <div>
            <h1>Schip van Morse</h1>
            <button onClick={() => handleClickButton()}>Spelen</button>
        </div>
    )
};

export default Welcome;