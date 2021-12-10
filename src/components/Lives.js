import styles from "./Lives.module.css";
import { Context } from "../context/Users";
import { useContext } from "react";


const Lives = () => {

    // eslint-disable-next-line
    const [state, dispatch] = useContext(Context);
    let currentLives;

    if (state.users.length > 0) {
        currentLives = state.users[0].lives;
    }

    return (
        <div className={styles.container}>
            <p>{currentLives} : &#9829; &#9829; &#9829;</p>
        </div>
    )
}; 

export default Lives;