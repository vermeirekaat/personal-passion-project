import React from "react";
import Login from "../components/Login";
import { useState, useEffect } from "react";

const Player = ({ socket }) => {
    const [username, setUsername] = useState("");
    const [confirmation, setConfirmation] = useState([]);

    useEffect(() => {
      socket?.emit("newUser", username);
    }, [socket, username]);

    useEffect(() => {
        socket?.on("codeConfirmation", (data) => {
            setConfirmation((prev) => [...prev, data]);
        });
    }, [socket]);
    console.log(confirmation);

    const generateName = input => {
        socket?.emit("insertName", input);
    }

    const generateCode = code => {
        socket?.emit("insertCode", username, code);
        socket?.emit("sendConfirmation", {
            player: username,
            code
        })
    };

    const checkStatus = () => {
        const index = confirmation.findIndex((item) => item.playerName.socketId === socket.id); 
        console.log(confirmation[index]);
        if (index !== -1 && confirmation[index].correct === true) {
            return true;
        } else {
            return false;
        }
    };

    if (checkStatus === true) {
        return (
            <p>HOORAY</p>
        )
    }

    return (
        <div>
            <h2>Player Screen</h2>
            {/*<Login getUsername={(user) => setUsername(user)} getCode={(code) => generateCode(code)}/>*/}
            <Login getInput={(input) => generateName(input)} getUsername={(user) => setUsername(user)} getCode={(code) => generateCode(code)}/>
        </div>
       
    )
};

export default Player;