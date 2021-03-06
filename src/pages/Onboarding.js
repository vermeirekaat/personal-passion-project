import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import { Link, useParams } from "react-router-dom";
import { usersContext } from "../context/Users";
import styles from "./Onboarding.module.css";

import Settings from "../components/Settings";
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
import PopUp from "../components/PopUp";

const Onboarding = () => {

    let { player } = useParams();


    // eslint-disable-next-line no-unused-vars
    const [users, setUsers] = useContext(usersContext);
    const socket = users[0].socket;
    const navigate = useNavigate();

    const [currentItem, setCurrentItem] = useState("");
    const [settings, setSettings] = useState({led: true, sound: true});
    const [amount, setAmount] = useState(0);
    const [userLost, setUserLost] = useState(false);
    const route = "rechts";
    const obstacle = "vuurtoren";
    const options = [{"word": "eiland"}, {"word": "vuurtoren"}, {"word": "tegenligger"}];
    const input = "";
    const result = "";

    useEffect(() => {
        socket?.emit("page", "onboarding");
    });

    useEffect(() => {
        socket?.on("userLost", () => {
            console.log("lost");
            setUserLost(true);
        });
    });

    useEffect(() => {
        socket?.on("handleChange", (data) => {
            setSettings(data);
        });
    }, [socket]);

    useEffect(() => {
        socket?.on("nextStep", (boolean) => {
            if (boolean) {
                setAmount(amount + 1);
            }
        });

        socket?.on("skip", (boolean) => {
            if (boolean) {
                setAmount(7);
            }
        })
    }, [socket, amount]);

    useEffect(() => {
        if (amount === 7) {
            socket?.emit("startGame", true);
            socket?.emit("saveLevels", settings);
        }
    }, [socket, amount, settings]);

    useEffect(() => {
        socket?.on("navigateGame", (boolean) => {
            if (boolean) {
                navigate(`/game/${player}`);
            }
        })
    }, [socket, navigate, player]);

    const checkOpacity = (item) => {
        if (currentItem === "Captain" || currentItem === "Sailor") {
            return true;
        } else if (currentItem === item) {
            return true;
        }
    };

    const handleChangeSettings = (data) => {
        setSettings(data);
        socket?.emit("settingsChange", data);
    };

    if (userLost === true) {
        console.log("user lost");
        return(
            <PopUp message="lost"/>
        )
    }

    if (player === "captain") {
        if (amount <= 6) {
            return (
                <div className={styles.grid}>
                    <div className={styles.skipContainer}>
                        <Settings setChange={(settings) => handleChangeSettings(settings)} player={player}/>
                    </div>
                    <div className={styles.avatar}>
                        <Avatar currentNumber={(amount)} showItem={(item) => setCurrentItem(item)}/>
                    </div>
                    <div className={styles.lives}>
                        <Lives opacity={checkOpacity("Lives")}/>
                    </div>
                    <div className={styles.controls}>
                        <Controls opacity={checkOpacity("Morse")}/>
                    </div>
                    <div className={styles.route}>
                        <Route currentDirection={route} opacity={checkOpacity("Route")}/>
                    </div>
                    <div className={styles.morse}>
                        <Morse morseInput={input} opacity={checkOpacity("Morse")}/>
                    </div>
                    <div className={styles.result}>
                        <Result result={result} opacity={checkOpacity("Result")}/>
                    </div>
                    <div className={styles.obstacle}>
                        <Obstacle currentObstacle={obstacle} opacity={checkOpacity("Obstacle")}/>
                    </div>
                    <div className={styles.cheatsheet}>
                        <CheatSheet opacity={checkOpacity("Cheatsheet")}/>
                    </div>
                </div>
            )
        } else if (amount === 7) {
            return (
                <PopUp/>
            )
        };    
    }; 

    if (player === "sailor") {
        if (amount <= 6) {
            return (
                <div className={styles.grid}>
                    <div className={styles.skipContainer}>
                        <Settings handleSettings={settings} player={player}/>
                    </div>
                    <div className={styles.avatar}>
                        <Avatar  currentNumber={(amount)} showItem={(item) => setCurrentItem(item)}/>
                    </div>
                    <div className={styles.lives}>
                        <Lives opacity={checkOpacity("Lives")}/>
                    </div>
                    <div className={styles.controls}>
                        <Controls opacity={checkOpacity("Options")}/>
                    </div>
                    <div className={styles.wheel}>
                        <Wheel currentRotation={""} opacity={checkOpacity("Wheel")}/>
                    </div>
                    <div className={styles.morse}>
                        <Morse morseInput={input} opacity={checkOpacity("Morse")}/>
                    </div>
                    <div className={styles.result}>
                        <Result result={result} opacity={checkOpacity("Result")}/>
                    </div>
                    <div className={styles.options}>
                        <Options currentOptions={options} opacity={checkOpacity("Options")}/>
                    </div>
                    <div className={styles.cheatsheet}>
                        <CheatSheet opacity={checkOpacity("Cheatsheet")}/>
                    </div>
                </div>
            )
        } else if (amount === 7) {
            return (
                <PopUp/>
            )
        }
    };

    return (
        <Link to="/">No user was found</Link>
    )
}; 

export default Onboarding;