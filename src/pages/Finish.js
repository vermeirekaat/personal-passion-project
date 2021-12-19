import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usersContext } from "../context/Users";
import styles from "./Finish.module.css";

import shipBlue from "./../assets/boot-b.svg";
import shipRed from "./../assets/boot-r.svg";

import treasureBlue from "./../assets/schat-b.svg";
import treasureRed from "./../assets/schat-r.svg";

const Finish = () => {

    const ship = {
        captain: shipBlue, 
        sailor: shipRed,
    };

    const treasure = {
        captain: treasureBlue,
        sailor: treasureRed,
    }

    let { player, message } = useParams();
    // eslint-disable-next-line no-unused-vars
    const [users, setUsers] = useContext(usersContext);
    const colors = users[0].colors;
    let navigate = useNavigate();

    setTimeout(() => {
        navigate("/");
    }, 5000);

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
    } 
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

    return (
        <div>
            <h1>Back to Home</h1>
        </div>
    )
}; 


export default Finish;