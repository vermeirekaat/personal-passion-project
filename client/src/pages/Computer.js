import React from "react";
import { useEffect } from "react";

const Computer = ({ socket }) => {
    const username = "computer";

    const code = Math.floor(1000 + Math.random() * 9000);

    useEffect(() => {
        socket?.emit("initialComputer", username, code.toString());
    }, [socket, username, code]);

    return (
        <div>
            <h2>Computer Screen</h2>
            <p>{code}</p>
        </div>
    )
};

export default Computer;