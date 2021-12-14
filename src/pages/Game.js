import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { usersContext } from "../context/Users";
import styles from "./Game.module.css";

import Lives from "../components/Lives";
import Route from "../components/Route";
import Wheel from "../components/Wheel";
import Morse from "../components/Morse";
import Result from "../components/Result";
import Obstacle from "../components/Obstacle";
import Options from "../components/Options";
import CheatSheet from "../components/CheatSheet";
import Popup from "../components/Popup";
import Controls from "../components/Controls";

const Game = () => {

    const [users, setUsers] = useContext(usersContext);

    const currentUser = users[0].user;
    const socket = users[0].socket;
    const colors = users[0].colors;
    let currentLives = users[0].lives;

    const [route, setRoute] = useState("");
    const [obstacle, setObstacle] = useState("");
    const [options, setOptions] = useState([""]);
    const [input, setInput] = useState("");
    const [result, setResult] = useState("");
    const [message, setMessage] = useState("");

    const [rotation, setRotation] = useState("");
    console.log(route);

    useEffect(() => {
        socket?.on("message", (message) => {
            setMessage(message);
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
        socket?.on("obstacles", (obstacle) => {
            setObstacle(obstacle);
        });
    }, [socket]);

    useEffect(() => {
        socket?.on("options", (options) => {
            setOptions(options);
        });
    }, [socket]);

    useEffect(() => {
        socket?.on("result", (message) => {
            setResult(message);
            if (message === "fail") {
                currentLives.shift();
    
                const copy = [...users]; 
                copy[0].lives = currentLives;
    
                setUsers(copy);
            };

        });
    }, [socket, currentLives, users, setUsers]);

    const checkMessage = () => {
        if (message !== "") {
            setTimeout(() => {
                setMessage("");
            }, 10000)
            return true;
        } else {
            return false;
        }
    }

    if (currentUser === "captain") {
        return (
            <div className={styles.grid}>
                <h2 className={styles.username} style={{ color: colors.reg}}>{currentUser}</h2>
                { checkMessage() && message.user === "captain" ?
                    <div className={styles.popup}>
                        <Popup currentMessage={message.message}/>
                    </div> : <div></div>
                }
                { checkMessage() && message.user === "both" ?
                    <div className={styles.popup}>
                        <Popup currentMessage={message.message}/>
                    </div> : <div></div>
                }
                <div className={styles.lives}>
                    <Lives/>
                </div>
                <div className={styles.controls}>
                    <Controls/>
                </div>
                <div className={styles.route}>
                    <Route currentDirection={route}/>
                </div>
                <div className={styles.obstacle}>
                    <Obstacle currentObstacle={obstacle}/>
                </div>
                <div className={styles.morse}>
                    <Morse morseInput={input}/>
                </div>
                <div className={styles.result}>
                    <Result result={result}/>
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
                <h2 className={styles.username} style={{ color: colors.reg}}>{currentUser}</h2>
                { checkMessage() && message.user === "sailor" ?
                    <div className={styles.popup}>
                        <Popup currentMessage={message.message}/>
                    </div> : <div></div>
                }
                { checkMessage() && message.user === "both" ?
                    <div className={styles.popup}>
                        <Popup currentMessage={message.message}/>
                    </div> : <div></div>
                }
                <div className={styles.lives}>
                    <Lives/>
                </div>
                <div className={styles.controls}>
                    <Controls/>
                </div>
                <div className={styles.wheel}>
                    <Wheel direction={rotation}/>
                </div>
                <div className={styles.options}>
                    <Options currentOptions={options}/>
                </div>
                <div className={styles.morse }>
                    <Morse morseInput={input}/>
                </div>
                <div className={styles.result}>
                    <Result result={result}/>
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