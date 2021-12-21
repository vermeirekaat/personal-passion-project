import styles from "./PopUp.module.css";
import { useContext } from "react";
import { usersContext } from "../context/Users";

import shipBlue from "./../assets/boot-b.svg";
import shipRed from "./../assets/boot-r.svg";

import treasureBlue from "./../assets/schat-b.svg";
import treasureRed from "./../assets/schat-r.svg";
import wheelBlue from "./../assets/stuur-b.svg";
import wheelRed from "./../assets/stuur-r.svg";

const PopUp = ({ message }) => {

    const ship = {
        captain: shipBlue, 
        sailor: shipRed,
    };

    const treasure = {
        captain: treasureBlue,
        sailor: treasureRed,
    };

    const wheel = {
        captain: wheelBlue, 
        sailor: wheelRed,
    };

    // eslint-disable-next-line no-unused-vars
    const [users, setUsers] = useContext(usersContext);
    const player = users[0].user;
    const colors = users[0].colors;

    if (message === "finish") {
        return (
            <div className={styles.container}>
                <div className={styles.inside} style={{ borderColor: colors.dark}}>
                    <div className={styles.border} style={{ borderColor: colors.reg}}>
                            <h1 className={styles.title} style={{ color: colors.dark}}>Ahoy!</h1>
                            <p className={styles.text}>Jullie hebben de schat bereikt!</p>
                            <img className={styles.svg} alt= "treasure" src={treasure[player]}/>
                            <p className={styles.tagline} style={{ color: colors.reg}}>Proficiat!</p>
                    </div>
                </div>
            </div>
            )
    }

    if (message === "fail") {
        return (
            <div className={styles.container}>
                <div className={styles.inside} style={{ borderColor: colors.dark}}>
                    <div className={styles.border} style={{ borderColor: colors.reg}}>
                        <h1 className={styles.title} style={{ color: colors.dark}}>Helaas...</h1>
                        <p className={styles.text}>Jullie hebben de tocht niet overleefd.</p>
                        <img className={styles.svg} alt="ship" src={ship[player]}/>
                        <p className={styles.tagline} style={{ color: colors.reg}}>Volgende keer beter!</p>
                    </div>

                    </div>
            </div>
        )
    };

    return (
        <div className={styles.container}>
            <div className={styles.inside} style={{ borderColor: colors.dark}}>
                <div className={styles.border} style={{ borderColor: colors.reg}}>
                        <h1 className={styles.title} style={{ color: colors.dark}}>Even geduld...</h1>
                        <p className={styles.text}>Wachten op andere speler...</p>
                        <img className={`${styles.svg} + ${styles.rotation}`} alt="wheel" src={wheel[player]}/>
                </div>
            </div>
        </div>
    )
}; 

export default PopUp;