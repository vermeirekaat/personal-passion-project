import styles from "./Route.module.css";
import { usersContext } from "../context/Users";
import { useContext } from "react";

import dirRight from "./../assets/pijl-r.svg";
import dirLeft from "./../assets/pijl-l.svg";


const Route = ({ currentDirection }) => {

    const direction = {
        rechts: dirRight, 
        links: dirLeft,
    };
    // eslint-disable-next-line no-unused-vars
    const [users, setUsers] = useContext(usersContext);
    const colors = users.colors;

    return (
        <div className={styles.container} style={{ borderColor: colors.dark}}>
            <div className={styles.inside} style={{ borderColor: colors.reg}}>
                { currentDirection !== "" ? 
                <>
                <p className={styles.text} style={{ color: colors.reg }}>{currentDirection}</p> <img className={styles.svg} alt="arrow-direction" src={direction[currentDirection]}/> </>
                : <p className={styles.text} style={{ color: colors.reg}}>Route</p> }
            </div>
        </div>
    )
}; 

export default Route;