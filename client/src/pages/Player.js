import React from "react";
import Login from "../components/Login";
import { useState, useEffect } from "react";

const Player = ({ socket }) => {
    const [username, setUsername] = useState("");

    useEffect(() => {
      socket?.emit("newUser", username);
    }, [socket, username]);

    const generateCode = code => {
        socket?.emit("insertCode", username, code);
        socket?.emit("sendConfirmation", {
            player: username,
            code
        })
    };

    return (
        <div>
            <h2>Player Screen</h2>
            <Login getUsername={(user) => setUsername(user)} getCode={(code) => generateCode(code)}/>
        </div>
       
    )
};

export default Player;