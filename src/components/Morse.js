import styles from "./Morse.module.css";
import { useState } from "react";

const Morse = ({ morseCode }) => {
    
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

    return (
        <div className={styles.container}>
            <p>Morse Code</p>
            <p>{input.toString()}</p>
            <input readOnly onKeyPress={handleMorseCode}></input>
        </div>
    )
}; 

export default Morse;