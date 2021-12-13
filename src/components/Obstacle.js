import styles from "./Obstacle.module.css";
import { usersContext } from "../context/Users";
import { useContext } from "react";

import vuurtorenSVG from "./../assets/toren-b.svg";
import eilandSVG from "./../assets/eiland-b.svg";
import tegenliggerSVG from "./../assets/boot-b.svg";
import ankerSVG from "./../assets/anker-b.svg";
import ijsbergSVG from "./../assets/berg-b.svg";

const Obstacle = ({ currentObstacle }) => {

    const obstacles = {
        vuurtoren: vuurtorenSVG,
        eiland: eilandSVG, 
        tegenligger: tegenliggerSVG,
        anker: ankerSVG, 
        ijsberg: ijsbergSVG,
    }

    // eslint-disable-next-line no-unused-vars
    const [users, setUsers] = useContext(usersContext);
    const colors = users.colors;
    
    return (
        <div className={styles.container} style={{ borderColor: colors.dark}}>

            <div className={styles.inside} style={{ borderColor: colors.reg}}>
                { currentObstacle !== "" ? 
                <>
                <p className={styles.text} style={{ color: colors.reg }}>{currentObstacle}</p> <img className={styles.svg} alt="obstacle" src={obstacles[currentObstacle]}/> </>
                : <p className={styles.text} style={{ color: colors.reg}}>Obstakel</p> }
            </div>

        </div>
    )
}; 

export default Obstacle;