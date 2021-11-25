import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Welcome = ({ socket }) => {

    const navigate = useNavigate();
    const [player, setPlayer] = useState("");

    useEffect(() => {
        socket?.on("onlineUsers", (data) => {
            const socketIndex = data.findIndex((user) => user.socketId === socket.id);
            setPlayer(data[socketIndex].username);
        });
    }, [socket]);

    const handleClickButton = () => {
        // console.log(socket.id);

        socket?.emit("newUser", socket.id);
    };

    if (player !== "") {
        navigate(`/${player}`);
    } if (player === undefined) {
        return false;
    }

    return(
        <div>
            <h1>Schip van Morse</h1>
            <button onClick={() => handleClickButton()}>Spelen</button>
        </div>
    )
};

export default Welcome;