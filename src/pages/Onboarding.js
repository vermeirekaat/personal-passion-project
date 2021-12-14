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

    // eslint-disable-next-line no-unused-vars
    const [users, setUsers] = useContext(usersContext);
    console.log(users);
    const currentUser = users[0].user;
    const socket = users[0].socket;
    const colors = users[0].colors;
    const navigate = useNavigate();

    const [currentItem, setCurrentItem] = useState("");
    const [amount, setAmount] = useState(0);
    const route = "rechts";
    const obstacle = "vuurtoren";
    const options = [{"word": "eiland"}, {"word": "vuurtoren"}, {"word": "tegenligger"}];
    const input = "";
    const result = "";

    useEffect(() => {
        socket?.emit("page", "onboarding");
    });

    useEffect(() => {
        socket?.on("nextStep", (boolean) => {
            if (boolean) {
                setAmount(amount + 1);
            }
        });

        socket?.on("skip", (boolean) => {
            console.log("skip");
            if (boolean) {
                setAmount(7);
            }
        })
    }, [socket, amount]);

    useEffect(() => {
        if (amount === 7) {
            setTimeout(() => {
                socket?.emit("startGame", true);
                navigate("/game");
            }, 1000)
        }
    }, [currentItem, socket, navigate, amount]);

    const checkOpacity = (item) => {
        if (currentItem === "Captain" || currentItem === "Sailor") {
            return true;
        } else if (currentItem === item) {
            return true;
        }
    }

    if (currentUser === "captain") {
        return (
            <div className={styles.grid}>
                <div className={styles.skipContainer}>
                    <button className={styles.skip} onClick={() => setCurrentItem("Game")} style={{ backgroundColor: colors.dark, color: colors.reg}}>Overslaan</button>
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
    }; 

    if (currentUser === "sailor") {
        return (
            <div className={styles.grid}>
                <div className={styles.skipContainer}>
                    <button className={styles.skip} onClick={() => setCurrentItem("Game")} style={{ backgroundColor: colors.reg, borderColor: colors.dark}}>Overslaan</button>
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
    };


    return (
        <Link to="/">No user was found</Link>
    )
}; 

export default Onboarding;