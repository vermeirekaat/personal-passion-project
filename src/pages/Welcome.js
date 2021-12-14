import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { usersContext } from "../context/Users";

const Welcome = ({ socket }) => {

    const navigate = useNavigate();
    const [player, setPlayer] = useState("");
    
    // eslint-disable-next-line no-unused-vars
    const [users, setUsers] = useContext(usersContext);

    useEffect(() => {
        socket?.on("onlineUsers", (data) => {
            const socketIndex = data.findIndex((user) => user.socketId === socket.id);
            setPlayer(data[socketIndex].username);
        });
    }, [socket]);

    useEffect(() => {
        const colorScheme = [{
            captain: {
                reg: "#09edf6",
                dark: "#043c7a",
            }, 
            sailor: {
                reg: "#ff0c0c", 
                dark: "#a00000",
            },
        }];

        if (player !== "") {
            setUsers([{
                user: player,
                socket: socket, 
                lives: [1, 2, 3],
                colors: colorScheme[0][player],
            }]);
            navigate("/game");
        } if (player === undefined) {
            return false;
        }
    }, [navigate, player, setUsers, socket]);

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