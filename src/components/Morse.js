import styles from "./Morse.module.css";

const Morse = ({ morseInput }) => {

    return (
        <div className={styles.container}>
            <p>Morse Code</p> 
            <p>{morseInput}</p>
        </div>
    )
}; 

export default Morse;