import styles from "./Options.module.css";
import { usersContext } from "../context/Users";
import { useContext } from "react";

import vuurtorenSVG from "./../assets/toren-r.svg";
import eilandSVG from "./../assets/eiland-r.svg";
import tegenliggerSVG from "./../assets/boot-r.svg";
import ankerSVG from "./../assets/anker-r.svg";
import ijsbergSVG from "./../assets/berg-r.svg";

const Options = ({ currentOptions, opacity }) => {

    const obstacles = {
        vuurtoren: vuurtorenSVG,
        eiland: eilandSVG, 
        tegenligger: tegenliggerSVG,
        anker: ankerSVG, 
        ijsberg: ijsbergSVG,
    };

    // eslint-disable-next-line no-unused-vars
    const [users, setUsers] = useContext(usersContext);
    const colors = users[0].colors;

    if (currentOptions.length > 1) {
        return (
            <div className={`${opacity === true ? styles.container : `${styles.container} ${styles.opacity}`}`} style={{ borderColor: colors.dark}}>
                <div className={styles.inside} style={{ borderColor: colors.reg, minHeight: "49rem"}}>
                    {currentOptions.map((option) => (
                        <div className={styles.option} key={option.word}>
                            <img className={styles.svg} alt="obstacle" src={obstacles[option.word]}/>
                            <p className={styles.text} style={{ color: colors.reg }}>{option.word}</p>
                        </div>
                    ))}
                </div>
        </div>
        )
    }

    return (
        <div className={`${opacity === true ? styles.container : `${styles.container} ${styles.opacity}`}`} style={{ borderColor: colors.dark}}>
            <div className={styles.inside} style={{ borderColor: colors.reg, minHeight: "49rem"}}>
                <p className={styles.text} style={{ color: colors.reg }}>Options</p>
                <p className={styles.text} style={{ color: colors.dark }}>{currentOptions[0]}</p>
            </div>
        </div>
    )
}; 

export default Options;