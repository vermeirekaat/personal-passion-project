import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { usersContext } from "../context/Users";
import styles from "./Onboarding.module.css";

import Avatar from "../components/Avatar";
import Lives from "../components/Lives";
import Controls from "../components/Controls";
import Route from "../components/Route";
import Wheel from "../components/Wheel";
import Morse from "../components/Morse";
import Result from "../components/Result";
import Obstacle from "../components/Obstacle";
import Options from "../components/Options";
import CheatSheet from "../components/CheatSheet";

const Onboarding = () => {

    const [users, setUsers] = useContext(usersContext);
    const currentUser = users[0].user;
    const socket = users[0].socket;
    const colors = users[0].colors;
    const navigate = useNavigate();

    const [currentItem, setCurrentItem] = useState("");
    const [route, setRoute] = useState("");
    const [input, setInput] = useState("");
    const [result, setResult] = useState("");

    const handleInput = (input) => {
        socket?.emit("morseInput", input);
    };

    const handleDirection = (direction) => {
        socket?.emit("inputDirection", direction);
    }

    useEffect(() => {
        socket?.on("inputMorse", (data) => {
            setInput(data);
        });
    }, [socket]);

    useEffect(() => {
        socket?.on("direction", (direction) => {
            setRoute(direction);
        });
    }, [socket]);

    useEffect(() => {
        socket?.on("message", (message) => {
            console.log(message);
        });
    }, [socket]);

    useEffect(() => {
        socket?.on("result", (message) => {
            setResult(message);
        });
    }, [socket]);

    useEffect(() => {
        if (currentItem === "Game") {
            socket?.emit("startGame", true);
            navigate("/game");
        }
    }, [currentItem, socket, navigate]);

    if (currentUser === "captain") {
        return (
            <div className={styles.grid}>
                <div className={styles.skipContainer}>
                    <button className={styles.skip} onClick={() => setCurrentItem("Game")} style={{ backgroundColor: colors.dark, color: colors.reg}}>Skip Onboarding</button>
                </div>
                <div className={styles.avatar}>
                    <Avatar showItem={(item) => setCurrentItem(item)}/>
                </div>
                <div className={`${currentItem === "Lives" ? styles.opacity : styles.lives}`}>
                    <Lives/>
                </div>
                <div className={styles.controls}>
                    <Controls/>
                </div>
                <div className={`${currentItem === "Route" ? styles.opacity : styles.route}`}>
                    <Route currentDirection={route}/>
                </div>
                <div className={`${currentItem === "Morse" ? styles.opacity : styles.morse }`}>
                    <Morse morseCode={(input) => handleInput(input)} />
                </div>
                <div className={`${currentItem === "Result" ? styles.opacity : styles.result }`}>
                    <Result result={result}/>
                </div>
                <div className={`${currentItem === "Obstacle" ? styles.opacity : styles.obstacle}`}>
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
                <button className={styles.skip} onClick={() => setCurrentItem("Game")}>Skip Onboarding</button>
                <div className={styles.avatar}>
                    <Avatar showItem={(item) => setCurrentItem(item)}/>
                </div>
                <div className={`${currentItem === "Lives" ? styles.opacity : styles.lives}`}>
                    <Lives/>
                </div>
                <div className={styles.controls}>
                    <Controls/>
                </div>
                <div className={`${currentItem === "Storm" ? styles.opacity : styles.storm}`}>
                    <Wheel/>
                </div>
                <div className={`${currentItem === "Morse" ? styles.opacity : styles.morse }`}>
                    <Morse morseInput={input} getDirection={(direction) => handleDirection(direction)}/>
                </div>
                <div className={`${currentItem === "Result" ? styles.opacity : styles.result}`}>
                    <Result result={result}/>
                </div>
                <div className={`${currentItem === "Options" ? styles.opacity : styles.options}`}>
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