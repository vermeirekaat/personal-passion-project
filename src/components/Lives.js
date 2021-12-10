import styles from "./Lives.module.css";
import { usersContext } from "../context/Users";
import { useContext } from "react";


const Lives = () => {

    // eslint-disable-next-line no-unused-vars
    const [users, setUsers] = useContext(usersContext);

    if (users.lives.length <= 0) {
        return (
            <div className={styles.container}>
                <p>Game Over</p>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            {users.lives.map((live) => (
                <p key={live}>&#9829;</p>
            ))}
        </div>
    )
}; 

export default Lives;