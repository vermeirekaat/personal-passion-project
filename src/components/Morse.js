import styles from "./Morse.module.css";
import { useState } from "react";

const Morse = () => {
    
    const [input, setInput] = useState([]);

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

    console.log(input);
    return (
        <div className={styles.container}>
            <p>Morse Code</p>
            <p>{input.toString()}</p>
            <input readOnly onKeyPress={handleMorseCode}></input>
        </div>
    )
}; 

export default Morse;