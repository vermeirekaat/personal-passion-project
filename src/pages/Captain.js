import styles from "./Captain.module.css";
import { useState } from "react";
import Avatar from "../components/Avatar";
import Lives from "../components/Lives";
import Route from "../components/Route";
import Morse from "../components/Morse";
import Result from "../components/Result";
import Obstacle from "../components/Obstacle";
import CheatSheet from "../components/CheatSheet";

const Captain = ({ username, socket }) => {
    
    const [currentItem, setCurrentItem] = useState("");

    const handleInput = (input) => {
        console.log(input);
    }

    return (
        <div className={styles.grid}>
             <div className={styles.avatar}>
                <Avatar player={username} showItem={(item) => setCurrentItem(item)}/>
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

export default Captain;