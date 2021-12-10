import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../context/Users";
import styles from "./Game.module.css";

import Lives from "../components/Lives";
import Route from "../components/Route";
import Storm from "../components/Storm";
import Morse from "../components/Morse";
import Result from "../components/Result";
import Obstacle from "../components/Obstacle";
import Options from "../components/Options";
import CheatSheet from "../components/CheatSheet";
import Popup from "../components/Popup";

const Game = () => {

    // eslint-disable-next-line
    const [state, dispatch] = useContext(Context);

    let currentUser;
    let socket;
    if (state.users.length > 0) {
        currentUser = state.users[0].user;
        socket = state.users[0].socket;
    }

    const [route, setRoute] = useState("");
    const [obstacle, setObstacle] = useState("");
    const [options, setOptions] = useState(["wait for message"]);
    const [input, setInput] = useState("");
    const [result, setResult] = useState("");
    const [message, setMessage] = useState("");

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
        });
    }, [socket]);

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
                <h2 className={styles.username}>{currentUser}</h2>
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
                <div className={styles.route}>
                    <Route currentDirection={route}/>
                </div>
                <div className={styles.morse}>
                    <Morse morseInput={input}/>
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
                <div className={styles.storm}>
                    <Storm/>
                </div>
                <div className={styles.morse }>
                    <Morse morseInput={input}/>
                </div>
                <div className={styles.result}>
                    <Result result={result}/>
                </div>
                <div className={styles.options}>
                    <Options currentOptions={options}/>
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