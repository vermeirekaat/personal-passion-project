import styles from "./Wait.module.css";
import { useContext } from "react";
import { usersContext } from "../context/Users";

import wheelBlue from "./../assets/stuur-b.svg";
import wheelRed from "./../assets/stuur-r.svg";

const Wait = () => {


    const wheel = {
        captain: wheelBlue, 
        sailor: wheelRed,
    };

    // eslint-disable-next-line no-unused-vars
    const [users, setUsers] = useContext(usersContext);
    const player = users[0].username;
    const colors = users[0].colors;

    return (
        <div className={styles.container}>
            <div className={styles.inside} style={{ borderColor: colors.dark}}>
                <div className={styles.border} style={{ borderColor: colors.reg}}>
                        <h1 className={styles.title} style={{ color: colors.dark}}>Even geduld...</h1>
                        <p className={styles.text}>Wachten op andere speler...</p>
                        <img className={`${styles.svg} + ${styles.rotation}`} alt= "wheel" src={wheel[player]}/>
                </div>
            </div>
        </div>
    )
}; 

export default Wait;