import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../context/Store";
import styles from "./Onboarding.module.css";

import Avatar from "../components/Avatar";
import Lives from "../components/Lives";
import Route from "../components/Route";
import Storm from "../components/Storm";
import Morse from "../components/Morse";
import Result from "../components/Result";
import Obstacle from "../components/Obstacle";
import Options from "../components/Options";
import CheatSheet from "../components/CheatSheet";

const Onboarding = ({ socket }) => {

    // eslint-disable-next-line
    const [state, dispatch] = useContext(Context);

    let currentUser;
    // let socketId;
    if (state.users.length > 0) {
        currentUser = state.users[0].user;
        // socketId = state.users[0].socket;
    }

    const [currentItem, setCurrentItem] = useState("");
    const [input, setInput] = useState("");

    const handleInput = (input) => {
        socket?.emit("morseInput", input);
    };

    useEffect(() => {
        socket?.on("inputMorse", (data) => {
            setInput(data);
        });
    }, [socket]);

    if (currentUser === "captain") {
        return (
            <div className={styles.grid}>
                <div className={styles.avatar}>
                    <Avatar player={currentUser} showItem={(item) => setCurrentItem(item)}/>
                </div>
                <div className={`${currentItem === "Lives" ? styles.opacity : styles.lives}`}>
                    <Lives/>
                </div>
                <div className={`${currentItem === "Route" ? styles.opacity : styles.route}`}>
                    <Route/>
                </div>
                <div className={`${currentItem === "Morse" ? styles.opacity : styles.morse }`}>
                    <Morse morseCode={(input) => handleInput(input)}/>
                </div>
                <div className={`${currentItem === "Result" ? styles.opacity : styles.result }`}>
                    <Result/>
                </div>
                <div className={`${currentItem === "Obstacle" ? styles.opacity : styles.obstacle }`}>
                    <Obstacle/>
                </div>
                <div className={`${currentItem === "CheatSheet" ? styles.opacity : styles.cheatsheet}`}>
                    <CheatSheet/>
                </div>
            </div>
        )
    }; 

    if (currentUser === "sailor") {
        return (
            <div className={styles.grid}>
                <div className={styles.avatar}>
                    <Avatar player={currentUser} showItem={(item) => setCurrentItem(item)}/>
                </div>
                <div className={`${currentItem === "Lives" ? styles.opacity : styles.lives}`}>
                    <Lives/>
                </div>
                <div className={`${currentItem === "Storm" ? styles.opacity : styles.storm}`}>
                    <Storm/>
                </div>
                <div className={`${currentItem === "Morse" ? styles.opacity : styles.morse }`}>
                    <Morse morseInput={input}/>
                </div>
                <div className={`${currentItem === "Result" ? styles.opacity : styles.result }`}>
                    <Result/>
                </div>
                <div className={`${currentItem === "Options" ? styles.opacity : styles.options }`}>
                    <Options/>
                </div>
                <div className={`${currentItem === "CheatSheet" ? styles.opacity : styles.cheatsheet}`}>
                    <CheatSheet/>
                </div>
            </div>
        )
    };


    return (
        <Link to="/">No user was found</Link>
    )
}; 

export default Onboarding;