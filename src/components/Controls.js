import styles from "./Controls.module.css";
import { usersContext } from "../context/Users";
import { useContext } from "react";

import bolSVG from "./../assets/button-point.svg";
import streepSVG from "./../assets/button-flat.svg";
import oneSVG from "./../assets/button-one.svg";
import twoSVG from "./../assets/button-two.svg";
import threeSVG from "./../assets/button-three.svg";

const Controls = ({ opacity }) => {

    const controls = {
        captain: [bolSVG, streepSVG], 
        sailor: [oneSVG, twoSVG, threeSVG],
    };

    // eslint-disable-next-line no-unused-vars
    const [users, setUsers] = useContext(usersContext);
    const currentUser = users[0].user;

    return (
        <div className={`${opacity === true ? styles.container : `${styles.container} ${styles.opacity}`}`}>
            {controls[currentUser].map((control) => (
                <img className={styles.svg} key={controls[currentUser].indexOf(control)}alt="control-button" src={control}/>
            ))}
        </div>
    )
}; 

export default Controls;