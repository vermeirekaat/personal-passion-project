import React from "react";
import { useEffect } from "react";

const Computer = ({ socket }) => {
    const username = "computer";

    const code = Math.floor(1000 + Math.random() * 9000);

    useEffect(() => {
        socket?.emit("newUser", username, code);
    }, [socket, username, code]);

    return (
        <div>
            <h2>Computer Screen</h2>
            <p>{code}</p>
        </div>
       
    )
};

export default Computer;