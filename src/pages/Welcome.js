import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usersContext } from "../context/Users";
import Settings from "../components/Settings";
import styles from "./Welcome.module.css";

import shipBlue from "./../assets/boot-b.svg";
import shipRed from "./../assets/boot-r.svg";

const Welcome = ({ socket }) => {

    // eslint-disable-next-line no-unused-vars
    const [users, setUsers] = useContext(usersContext);
    const navigate = useNavigate();
    const [ready, setReady] = useState(false);
    const [led, setLed] = useState(true);
    const [sound, setSound] = useState(true);

    useEffect(() => {
        socket?.on("boardReady", (boolean) => {
            setReady(boolean);
        });
    }, [socket]);

    const handleClickPlayer = (player) => {
        if (!ready) {
            console.log(player);
            socket?.emit("newPlayer", player.name);

            socket?.emit("settings", [led, sound]);

            setUsers([{
                user: player.name, 
                nl: player.nl,
                socket: socket,
                lives: [3, 2, 1], 
                colors: player.colors,
            }]); 

            navigate(`/onboarding/${player.name}`)
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.settings}>
                <Settings ledState={(led) => setLed(led)} soundState={(sound) => setSound(sound)} led={led} sound={sound}/>
            </div>
            <h1 className={styles.title}>Schip van Morse</h1>
            <div className={styles.buttonContainer}>
                <div className={styles.border} style={{borderColor: "#043c7a"}}>
                    <img className={styles.svg} alt="ship-blue" src={shipBlue}/>
                    <button className={styles.button} onClick={() => handleClickPlayer({name: "captain", nl:"kapitein", colors: {reg: "#09edf6", dark: "#043c7a"}})} style={{ color: "#09edf6"}}>Kapitein</button>
                </div>

                <div className={styles.border} style={{borderColor: "#a00000"}}>
                    <img className={styles.svg} alt="ship-red" src={shipRed}/>
                    <button className={styles.button} onClick={() => handleClickPlayer({name: "sailor", nl:"matroos", colors: {reg: "#ff0c0c", dark: "#a00000"}})} style={{ color: "#ff0c0c", backgroundImage: shipRed}}>Matroos</button>
                </div>
            </div>
        </div>
    )
}; 

export default Welcome;