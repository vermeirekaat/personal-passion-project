import React from "react";
import { useState, useEffect } from "react";

const Computer = ({ socket, code }) => {
    const username = "computer";
    const [confirmation, setConfirmation] = useState([]);

    useEffect(() => {
        socket?.emit("initialComputer", username, code.toString());
    }, [socket, username, code]);

    useEffect(() => {
        socket?.on("codeConfirmation", (data) => {
            console.log(data);
            setConfirmation((prev) => [...prev, data]);
        });
    }, [socket]);

    console.log(confirmation);

    return (
        <div>
            <h2>Computer Screen</h2>
            <p>{code}</p>
            { confirmation.length >= 0 ? 
            confirmation.map((item) => (
                item.correct ? 
                <p key={item.playerName.username}> {item.playerName.username} is connected</p> : <p>Opniew proberen</p>
             )) : 
            <p>Code invoeren</p> }
        </div>
    )
};

export default Computer;