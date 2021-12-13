import styles from "./Lives.module.css";
import { usersContext } from "../context/Users";
import { useContext } from "react";

import heartBlue from "./../assets/hart-b.svg";
import heartRed from "./../assets/hart-r.svg";


const Lives = () => {

    const assets = {
        captain: heartBlue, 
        sailor: heartRed,
    }

    // eslint-disable-next-line no-unused-vars
    const [users, setUsers] = useContext(usersContext);
    const currentUser = users.user;
    const colors = users.colors;

    if (users.lives.length <= 0) {
        return (
            <div className={styles.container} style={{ borderColor: colors.dark}}>
                <div className={styles.inside} style={{ borderColor: colors.reg}}>
                    <p className={styles.text} style={{ color: colors.reg}}>Game Over</p>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.container} style={{ borderColor: colors.dark}}>
            <div className={styles.inside} style={{ borderColor: colors.reg}}>
                {users.lives.map((life) => (
                    <img className={styles.svg} alt="heart" key={life} src={assets[currentUser]}/>
                ))}
            </div>
        </div>
    )
}; 

export default Lives;