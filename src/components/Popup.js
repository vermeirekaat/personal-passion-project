import styles from "./Popup.module.css";

const Popup = ({ currentMessage }) => {

    return (
        <div className={styles.container}>
            <p className={styles.message}>{currentMessage}</p>
        </div>
    )
}; 

export default Popup;