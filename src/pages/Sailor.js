import styles from "./Sailor.module.css";
import Avatar from "../components/Avatar";
import Lives from "../components/Lives";
import Storm from "../components/Storm";
import Morse from "../components/Morse";
import Result from "../components/Result";
import Options from "../components/Options";
import CheatSheet from "../components/CheatSheet";

const Sailor = ({ username, socket }) => {

    return (
        <div className={styles.grid}>
            <div className={styles.avatar}>
                <Avatar player={username}/>
            </div>
            <div className={styles.lives}>
                <Lives/>
            </div>
            <div className={styles.storm}>
                <Storm/>
            </div>
            <div className={styles.morse}>
                <Morse/>
            </div>
            <div className={styles.result}>
                <Result/>
            </div>
            <div className={styles.options}>
                <Options/>
            </div>
            <div className={styles.cheatsheet}>
                <CheatSheet/>
            </div>
        </div>
       
    )
};

export default Sailor;