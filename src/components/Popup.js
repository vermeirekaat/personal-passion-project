import styles from "./Popup.module.css";
import { usersContext } from "../context/Users";
import { useContext } from "react";

const Popup = ({ currentMessage }) => {

    // eslint-disable-next-line no-unused-vars
    const [users, setUsers] = useContext(usersContext);
    const colors = users.colors;

    return (
        <div className={styles.container} style={{ backgroundColor: colors.reg}}>
            <p className={styles.text}>{currentMessage}</p>
        </div>
    )
}; 

export default Popup;