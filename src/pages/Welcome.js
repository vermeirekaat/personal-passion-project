import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../context/Users";

const Welcome = ({ socket }) => {

    const navigate = useNavigate();
    const [player, setPlayer] = useState("");
    const [state, dispatch] = useContext(Context);

    useEffect(() => {
        socket?.on("onlineUsers", (data) => {
            const socketIndex = data.findIndex((user) => user.socketId === socket.id);
            setPlayer(data[socketIndex].username);
        });
    }, [socket]);

    useEffect(() => {
        if (state.error) {
            return <p>Something went wrong: <span>{state.error}</span></p>;
        }
        if (player !== "") {
            dispatch({type: 'ADD_USER', payload: { socket: socket, user: player }});
            navigate("/game");
        } if (player === undefined) {
            return false;
        }
    }, [dispatch, navigate, player, socket, state.error]);

    const handleClickButton = () => {
        socket?.emit("newUser", socket.id);
    };

    return(
        <div>
            <h1>Schip van Morse</h1>
            <button onClick={() => handleClickButton()}>Spelen</button>
        </div>
    )
};

export default Welcome;