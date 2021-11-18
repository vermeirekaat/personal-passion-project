import React from "react";
import Login from "../components/Login";
import { useState, useEffect } from "react";

const Player = ({ socket }) => {
    const [username, setUsername] = useState("");
    // const [code, setCode] = useState("");

    useEffect(() => {
      socket?.emit("newUser", username);
    }, [socket, username]);

    // useEffect(() => {
    //     socket?.emit("insertCode", code);
    // }, [socket, username, code]);


    const generateCode = code => {
        socket?.emit("insertCode", username, code);
    }
    return (
        <div>
            <h2>Player Screen</h2>
            <Login getUsername={(user) => setUsername(user)} getCode={(code) => generateCode(code)}/>
        </div>
       
    )
};

export default Player;