import { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
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
import Controls from "../components/Controls";
import MultiPlayer from "../components/MultiPlayer";

const Game = () => {

    let { player } = useParams();
    const [users, setUsers] = useContext(usersContext);

    const usernameNL = users[0].nl;
    const socket = users[0].socket;
    const colors = users[0].colors;
    let currentLives = users[0].lives;

    const [route, setRoute] = useState("");
    const [obstacle, setObstacle] = useState("");
    const [options, setOptions] = useState("");
    const [input, setInput] = useState("");
    const [result, setResult] = useState("");
    const [rotation, setRotation] = useState("");
    const [sound, setSound] = useState([]);
    const [soundReady, setSoundReady] = useState(false);

    useEffect(() => {
        socket?.emit("page", "game");
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
        socket?.on("inputSound", (data) => {
            setSound(data);
        })
    });

    useEffect(() => {
        socket?.on("soundReady", (boolean) => {
            setSoundReady(boolean);
        })
    });

    useEffect(() => {
        socket?.on("level", (level) => {
            console.log(level);
        })
    })

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

    const checkOpacity = (item) => {
        if (item !== "") {
            return true;
        };
    };

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
                    {sound.length <= 0 ? "" : <MultiPlayer inputArray={sound} ready={soundReady}/>}
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