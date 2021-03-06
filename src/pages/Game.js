import { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { usersContext } from "../context/Users";
import styles from "./Game.module.css";

import PopUp from "../components/PopUp";
import Lives from "../components/Lives";
import Route from "../components/Route";
import Wheel from "../components/Wheel";
import Morse from "../components/Morse";
import Result from "../components/Result";
import Obstacle from "../components/Obstacle";
import Options from "../components/Options";
import CheatSheet from "../components/CheatSheet";
import Controls from "../components/Controls";

const Game = () => {

    let { player } = useParams();
    const [users, setUsers] = useContext(usersContext);
    let navigate = useNavigate();

    const usernameNL = users[0].nl;
    const socket = users[0].socket;
    const colors = users[0].colors;
    let currentLives = users[0].lives;

    const [userLost, setUserLost] = useState(false);
    const [route, setRoute] = useState("");
    const [obstacle, setObstacle] = useState("");
    const [options, setOptions] = useState("");
    const [input, setInput] = useState("");
    const [result, setResult] = useState("");
    const [rotation, setRotation] = useState("");

    useEffect(() => {
        socket?.emit("page", "game");
    });

    useEffect(() => {
        socket?.on("userLost", () => {
            setUserLost(true);
        });
    });

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
        socket?.on("getRotation", (rotation) => {
            setRotation(rotation);
        });
    }, [socket]);

    useEffect(() => {
        socket?.on("result", (message) => {
            if (message === "fout") {
                currentLives.shift();
    
                const copy = [...users]; 
                copy[0].lives = currentLives;
    
                setUsers(copy);
            } else if (message === "finish") {
                navigate(`/finish/${message}`);
            }
            setResult(message);
        });
    }, [socket, currentLives, users, setUsers, player, navigate]);

    const checkOpacity = (item) => {
        if (item !== "" || item === "opacity") {
            return true;
        };
    };

    if (userLost === true) {
        console.log("user lost");
        return(
            <PopUp message="lost"/>
        )
    }

    if (player === "captain") {
        return (
            <div className={styles.grid}>
                <h2 className={styles.username} style={{ color: colors.reg}}>{usernameNL}</h2>
                <div className={styles.lives}>
                    <Lives opacity={true}/>
                </div>
                <div className={styles.controls}>
                    <Controls opacity={true}/>
                </div>
                <div className={styles.route}>
                    <Route currentDirection={route} opacity={checkOpacity(route)}/>
                </div>
                <div className={styles.obstacle}>
                    <Obstacle currentObstacle={obstacle} opacity={checkOpacity(obstacle)}/>
                </div>
                <div className={styles.morse}>
                    <Morse morseInput={input} opacity={checkOpacity(input)}/>
                </div>
                <div className={styles.result}>
                    <Result result={result} opacity={checkOpacity(result)}/>
                </div>
                <div className={styles.cheatsheet}>
                    <CheatSheet opacity={true}/>
                </div>
            </div>
        )
    }; 

    if (player === "sailor") {
        return (
            <div className={styles.grid}>
                <h2 className={styles.username} style={{ color: colors.reg}}>{usernameNL}</h2>
                <div className={styles.lives}>
                    <Lives opacity={true}/>
                </div>
                <div className={styles.controls}>
                    <Controls opacity={true}/>
                </div>
                <div className={styles.wheel}>
                    <Wheel currentRotation={rotation} opacity={checkOpacity(rotation)}/>
                </div>
                <div className={styles.options}>
                    <Options currentOptions={options} opacity={checkOpacity(options)}/>
                </div>
                <div className={styles.morse}>
                    <Morse morseInput={input} opacity={checkOpacity(input)}/>
                </div>
                <div className={styles.result}>
                    <Result result={result} opacity={checkOpacity(result)}/>
                </div>
                <div className={styles.cheatsheet}>
                    <CheatSheet opacity={true}/>
                </div>
            </div>
        )
    };


    return (
        <Link to="/">No user was found</Link>
    )
}; 

export default Game;