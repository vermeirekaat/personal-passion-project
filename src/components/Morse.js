import styles from "./Morse.module.css";

import { usersContext } from "../context/Users";
import { useContext } from "react";

const Morse = ({ morseInput }) => {

    // eslint-disable-next-line no-unused-vars
    const [users, setUsers] = useContext(usersContext);
    const colors = users.colors;

    return (
        <div className={styles.container} style={{ borderColor: colors.dark}}>
            <div className={styles.inside} style={{ borderColor: colors.reg}}>

                {morseInput !== "" ? 
                <p className={styles.text} style={{ color: colors.reg}}>{morseInput}</p> : 
                <p className={styles.text} style={{ color: colors.reg}}>Morse Code</p>}

            </div>
        </div>
    )
}; 

export default Morse;