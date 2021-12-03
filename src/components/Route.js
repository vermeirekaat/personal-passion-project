import styles from "./Route.module.css";

const Route = ({ currentDirection }) => {

    return (
        <div className={styles.container}>
            <p>Route</p>
            <p>{currentDirection}</p>
        </div>
    )
}; 

export default Route;