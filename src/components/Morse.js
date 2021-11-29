import styles from "./Morse.module.css";
import { useState, useContext } from "react";

import { Context } from "../context/Store";

const Morse = ({ morseCode }) => {

    // eslint-disable-next-line
    const [state, dispatch] = useContext(Context);
    const indexCaptain = state.users.findIndex((user) => user.user === "captain");
    
    const [input, setInput] = useState([]);
    morseCode(input);

    const handleMorseCode = (e) => {
        const copy = [...input];
            if (e.key === "a") {
                copy.push(".");
                setInput(copy);
            };
            if (e.key === "z") {
                copy.push("-");
                setInput(copy);
            }; 
    };

    if (indexCaptain > -1) {
        return (
            <div className={styles.container}>
                <p>Morse Code</p>
                <p>{input.toString()}</p>
                <input readOnly onKeyPress={handleMorseCode}></input>
            </div>
        )
    } else if (indexCaptain === -1 ) {
        return (
            <div className={styles.container}>
                <p>Morse Code - Sailor</p>
            </div>
        )
    };

    return (
        <div className={styles.container}>
            <p>Morse Code - Try</p>
        </div>
    )
}; 

export default Morse;