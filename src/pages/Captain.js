import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { usersContext } from "../context/Users";

const Captain = ({ socket }) => {

    const navigate = useNavigate();
    const [ready, setReady] = useState(false);
    const player = "captain";
    
    // eslint-disable-next-line no-unused-vars
    const [users, setUsers] = useContext(usersContext);

    useEffect(() => {
        socket?.emit("newPlayer", player);

        socket?.on("boardReady", (boolean) => {
            setReady(boolean);
        })
    }, [socket]);

    useEffect(() => {
        // if (ready === true) {
            setUsers([{
                user: player,
                nl: "kapitein",
                socket: socket, 
                lives: [1, 2, 3],
                colors: {reg: "#09edf6", dark: "#043c7a"},
            }]);
            navigate(`/onboarding/${player}`);
        // };
    }, [navigate, ready, setUsers, socket]);

    if (ready !== true) {
        return (
            <div>
                <h1>Het Schip van Morse</h1>
                <p>Even geduld...</p>
            </div>
        )
    }

    return(
        <div>
            <h1>Schip van Morse</h1>
        </div>
    )
};

export default Captain;