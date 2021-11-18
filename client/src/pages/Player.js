import React from "react";
import Homescreen from "../components/Homescreen";
import { useState, useEffect } from "react";

const Player = ({ socket }) => {
    const [username, setUsername] = useState("");
    console.log(username);

    useEffect(() => {
      socket?.emit("newUser", username);
    }, [socket, username]);

    return (
        <div>
            <h2>Player Screen</h2>
            <Homescreen getUsername={(user) => setUsername(user)}/>
        </div>
       
    )
};

export default Player;