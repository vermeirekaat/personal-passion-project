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
    const player = users[0].user;
    const socket = users[0].socket;
    const colors = users[0].colors;
    const lives = users[0].lives;

    console.log(lives);

    if (lives.length === 0) {

        socket?.emit("gameOver", true);

        const message = "fail";

        setTimeout(() => {
            navigate(`/finish/${message}`)
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
                    <img className={styles.svg} alt="heart" key={life} src={assets[player]}/>
                ))}
            </div>
        </div>
    )
}; 

export default Lives;