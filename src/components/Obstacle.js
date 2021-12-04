import styles from "./Obstacle.module.css";

const Obstacle = ({ currentObstacle }) => {
    
    return (
        <div className={styles.container}>
            <p>Obstacle</p>
            <p>{currentObstacle}</p>
        </div>
    )
}; 

export default Obstacle;