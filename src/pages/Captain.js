import styles from "./Captain.module.css";
import Avatar from "../components/Avatar";
import Lives from "../components/Lives";
import Route from "../components/Route";
import Morse from "../components/Morse";
import Result from "../components/Result";
import Obstacle from "../components/Obstacle";
import CheatSheet from "../components/CheatSheet";

const Captain = ({ username, socket }) => {

    return (
        <div className={styles.grid}>
             <div className={styles.avatar}>
                <Avatar player={username}/>
            </div>
            <div className={styles.lives}>
                <Lives/>
            </div>
            <div className={styles.route}>
                <Route/>
            </div>
            <div className={styles.morse}>
                <Morse/>
            </div>
            <div className={styles.result}>
                <Result/>
            </div>
            <div className={styles.obstacle}>
                <Obstacle/>
            </div>
            <div className={styles.cheatsheet}>
                <CheatSheet/>
            </div>
        </div>
    )
};

export default Captain;