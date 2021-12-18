import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usersContext } from "../context/Users";

const Welcome = ({ socket }) => {

    // eslint-disable-next-line no-unused-vars
    const [users, setUsers] = useContext(usersContext);
    const navigate = useNavigate();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        socket?.on("boardReady", (boolean) => {
            setReady(boolean);
        });
    }, [socket]);

    const handleClickPlayer = (player) => {
        if (!ready) {
            socket?.emit("newPlayer", player.name);

            setUsers([{
                user: player.name, 
                nl: player.nl,
                socket: socket,
                lives: [1, 2, 3], 
                colors: player.colors,
            }]); 

            navigate(`/onboarding/${player.name}`)
        }
    }

    return (
        <div>
            <h1>Schip van Morse</h1>
            <button onClick={() => handleClickPlayer({name: "captain", nl:"kapitein", colors: {reg: "#09edf6", dark: "#043c7a"}})}>Captain</button>
            <button onClick={() => handleClickPlayer({name: "sailor", nl:"matroos", colors: {reg: "#ff0c0c", dark: "#a00000"}})}>Sailor</button>
        </div>
    )
}; 

export default Welcome;