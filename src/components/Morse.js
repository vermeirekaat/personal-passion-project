import styles from "./Morse.module.css";

import { usersContext } from "../context/Users";
import { useContext } from "react";

import lightRed from "./../assets/light-red.svg";
import soundRed from "./../assets/sound-red.svg";

const Morse = ({ morseInput, opacity }) => {

    // eslint-disable-next-line no-unused-vars
    const [users, setUsers] = useContext(usersContext);
    const colors = users[0].colors;

    const assets = {
        light: lightRed,
        sound: soundRed,
    }

    if (morseInput !== "") {
        if (morseInput === "light" || morseInput === "sound") {
            return (
                <div className={`${opacity === true ? styles.container : `${styles.container} ${styles.opacity}`}`} style={{ borderColor: colors.dark}}>
                <div className={styles.inside} style={{ borderColor: colors.reg}}>
                    <img className={styles.svg} alt={`${morseInput}-icon`} src={assets[morseInput]}/>
    
                </div>
            </div>
            )
        }
    }

    return (
        <div className={`${opacity === true ? styles.container : `${styles.container} ${styles.opacity}`}`} style={{ borderColor: colors.dark}}>
            <div className={styles.inside} style={{ borderColor: colors.reg}}>

                {morseInput !== "" ? 
                <p className={styles.text} style={{ color: colors.reg}}>{morseInput}</p> : 
                <p className={styles.text} style={{ color: colors.reg}}>Morse Code</p>}

            </div>
        </div>
    )
}; 

export default Morse;