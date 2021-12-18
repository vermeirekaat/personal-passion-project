import styles from "./Lives.module.css";
import { usersContext } from "../context/Users";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import heartBlue from "./../assets/hart-b.svg";
import heartRed from "./../assets/hart-r.svg";


const Lives = ({ opacity }) => {

    let navigate = useNavigate();

    const assets = {
        captain: heartBlue, 
        sailor: heartRed,
    };

    // eslint-disable-next-line no-unused-vars
    const [users, setUsers] = useContext(usersContext);
    const currentUser = users[0].user;
    const colors = users[0].colors;
    const lives = users[0].lives;

    if (lives.length <= 0) {

        const boolean = false;

        setTimeout(() => {
            navigate(`/finish/${boolean}`)
        }, 1000);
        
        return (
            <div className={`${opacity === true ? styles.container : `${styles.container} ${styles.opacity}`}`} style={{ borderColor: colors.dark}}>
                <div className={styles.inside} style={{ borderColor: colors.reg}}>
                    <p className={styles.text} style={{ color: colors.reg}}>Game Over</p>
                </div>
            </div>
        )
    }

    return (
        <div className={`${opacity === true ? styles.container : `${styles.container} ${styles.opacity}`}`} style={{ borderColor: colors.dark}}>
            <div className={styles.inside} style={{ borderColor: colors.reg}}>
                {lives.map((life) => (
                    <img className={styles.svg} alt="heart" key={life} src={assets[currentUser]}/>
                ))}
            </div>
        </div>
    )
}; 

export default Lives;