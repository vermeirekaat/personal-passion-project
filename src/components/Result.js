import styles from "./Result.module.css";

const Result = ({ result }) => {
    return (
        <div className={styles.container}>
            <p>Resultaat</p>
            <p>{result}</p>
        </div>
    )
}; 

export default Result;