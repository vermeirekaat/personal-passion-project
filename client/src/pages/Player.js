import React from "react";
import Login from "../components/Login";
import { useState, useEffect } from "react";

const Player = ({ socket }) => {
    const [username, setUsername] = useState("");

    useEffect(() => {
      socket?.emit("newUser", username);
    }, [socket, username]);

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

    return (
        <div>
            <h2>Player Screen</h2>
            {/*<Login getUsername={(user) => setUsername(user)} getCode={(code) => generateCode(code)}/>*/}
            <Login getInput={(input) => generateName(input)} getUsername={(user) => setUsername(user)} getCode={(code) => generateCode(code)}/>
        </div>
       
    )
};

export default Player;