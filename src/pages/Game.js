import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../context/Store";
import styles from "./Game.module.css";

import Lives from "../components/Lives";
import Route from "../components/Route";
import Storm from "../components/Storm";
import Morse from "../components/Morse";
import Result from "../components/Result";
import Obstacle from "../components/Obstacle";
import Options from "../components/Options";
import CheatSheet from "../components/CheatSheet";

const Game = ({ socket }) => {

    // eslint-disable-next-line
    const [state, dispatch] = useContext(Context);

    let currentUser;
    // let socketId;
    if (state.users.length > 0) {
        currentUser = state.users[0].user;
        // socketId = state.users[0].socket;
    }

    const [route, setRoute] = useState("");
    const [obstacle, setObstacle] = useState("");
    const [input, setInput] = useState("");
    const [result, setResult] = useState("");

    const handleInput = (input) => {
        socket?.emit("morseInput", input);
    };

    const handleDirection = (direction) => {
        socket?.emit("inputDirection", direction);
    }

    useEffect(() => {
        socket?.on("message", (message) => {
            console.log(message);
        });
    }, [socket]);

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
        socket?.on("obstacle", (obstacle) => {
            setObstacle(obstacle);
        });
    }, [socket]);

    useEffect(() => {
        socket?.on("result", (message) => {
            setResult(message);
        });
    }, [socket]);

    if (currentUser === "captain") {
        return (
            <div className={styles.grid}>
                <h2 className={styles.username}>{currentUser}</h2>
                <div className={styles.lives}>
                    <Lives/>
                </div>
                <div className={styles.route}>
                    <Route currentDirection={route}/>
                </div>
                <div className={styles.morse}>
                    <Morse morseCode={(input) => handleInput(input)}/>
                </div>
                <div className={styles.result}>
                    <Result result={result}/>
                </div>
                <div className={styles.obstacle}>
                    <Obstacle currentObstacle={obstacle}/>
                </div>
                <div className={styles.cheatsheet}>
                    <CheatSheet/>
                </div>
            </div>
        )
    }; 

    if (currentUser === "sailor") {
        return (
            <div className={styles.grid}>
                <h2 className={styles.username}>{currentUser}</h2>
                <div className={styles.lives}>
                    <Lives/>
                </div>
                <div className={styles.storm}>
                    <Storm/>
                </div>
                <div className={styles.morse }>
                    <Morse morseInput={input} getDirection={(direction) => handleDirection(direction)}/>
                </div>
                <div className={styles.result}>
                    <Result result={result}/>
                </div>
                <div className={styles.options}>
                    <Options/>
                </div>
                <div className={styles.cheatsheet}>
                    <CheatSheet/>
                </div>
            </div>
        )
    };


    return (
        <Link to="/">No user was found</Link>
    )
}; 

export default Game;