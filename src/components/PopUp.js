import styles from "./PopUp.module.css";
import { useContext, useEffect } from "react";
import { usersContext } from "../context/Users";

import shipBlue from "./../assets/boot-b.svg";
import shipRed from "./../assets/boot-r.svg";

import treasureBlue from "./../assets/schat-b.svg";
import treasureRed from "./../assets/schat-r.svg";
import wheelBlue from "./../assets/stuur-b.svg";
import wheelRed from "./../assets/stuur-r.svg";
import { useNavigate } from "react-router";

const PopUp = ({ message }) => {

    const navigate = useNavigate();

    useEffect(() => {
        if (message === "lost") {
            const boolean = true;

            setTimeout(() => {
                navigate(`/${boolean}`);
            }, 10000)
        }
    }, [navigate, message]);

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
                            <p className={styles.text}>Proficiat!</p>
                            <img className={styles.svg} alt= "treasure" src={treasure[player]}/>
                            <p className={styles.tagline} style={{ color: colors.reg}}>Klik op een knop om opnieuw te spelen</p>
                    </div>
                </div>
            </div>
            )
    } else if (message === "fail") {
        return (
            <div className={styles.container}>
                <div className={styles.inside} style={{ borderColor: colors.dark}}>
                    <div className={styles.border} style={{ borderColor: colors.reg}}>
                        <h1 className={styles.title} style={{ color: colors.dark}}>Helaas...</h1>
                        <p className={styles.text}>Jullie hebben de tocht niet overleefd.</p>
                        <p className={styles.text}>Volgende keer beter!</p>
                        <img className={styles.svg} alt="ship" src={ship[player]}/>
                        <p className={styles.tagline} style={{ color: colors.reg}}>Klik op een knop om opnieuw te spelen</p>
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
                        <p className={styles.text}>Om dit spel te spelen moet je met twee spelers zijn</p>
                        <img className={`${styles.svg} + ${styles.rotation}`} alt="wheel" src={wheel[player]}/>
                </div>
            </div>
        </div>
    )
}; 

export default PopUp;