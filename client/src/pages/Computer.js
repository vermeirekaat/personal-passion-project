import React from "react";
import { useState, useEffect } from "react";

const Computer = ({ socket, code }) => {
    const username = "computer";
    const [confirmation, setConfirmation] = useState([]);
    const [input, setInput] = useState([]);

    useEffect(() => {
        socket?.emit("initialComputer", username, code.toString());
    }, [socket, username, code]);

    useEffect(() => {
        socket?.on("codeConfirmation", (data) => {
            setConfirmation((prev) => [...prev, data]);
        });
    }, [socket]);

    useEffect(() => {
        socket?.on("inputPlayer", (inputServer) => {
            setInput((prev) => [...prev, inputServer]);
        });
    }, [socket]);

    const checkStatus = () => {
        confirmation.map((item) => {
            return item.correct.includes(true);
        })
    };

    if (confirmation.length === 2 && checkStatus) {
        return (
            <div>
                <h2>HOORAY!</h2>
            </div>
        )
    }
 
    return (
        <div>
            <h2>Computer Screen</h2>
            <p>{code}</p>

            { input.length > 0 ?
            
            input.map((item) => (
                <p key={item}>{item}</p>
            )) : <p>Naam invoeren</p> }

            { confirmation.length > 0 ? 
            confirmation.map((item) => (
                item.correct ? 
                <p key={item.playerName.username}> {item.playerName.username} is connected</p> : <p>Opniew proberen</p>
             )) : 
            <p>Code invoeren</p> }
        </div>
    )
};

export default Computer;