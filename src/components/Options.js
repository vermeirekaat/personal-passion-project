import styles from "./Options.module.css";

const Options = ({ currentOptions }) => {

    if (currentOptions.length > 1) {
        return (
            <div className={styles.container}>
            <p>Options</p>
            {currentOptions.map((option) => (
                <p key={option.word}>{option.word}</p>
            ))}
        </div>
        )
    }

    return (
        <div className={styles.container}>
            <p>Options</p>
            <p>{currentOptions[0]}</p>
        </div>
    )
}; 

export default Options;