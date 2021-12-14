import styles from "./Morse.module.css";

import { usersContext } from "../context/Users";
import { useContext } from "react";

const Morse = ({ morseInput, opacity }) => {

    // eslint-disable-next-line no-unused-vars
    const [users, setUsers] = useContext(usersContext);
    const colors = users[0].colors;

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