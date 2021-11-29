import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../context/Store";

const Welcome = ({ socket }) => {

    const navigate = useNavigate();
    const [player, setPlayer] = useState("");
    const [state, dispatch] = useContext(Context);
    // username(player);

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

    if (state.error) {
        return <p>Something went wrong: <span>{state.error}</span></p>;
    }
    if (player !== "") {
        dispatch({type: 'ADD_USER', payload: { socket: socket.id, user: player }});
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