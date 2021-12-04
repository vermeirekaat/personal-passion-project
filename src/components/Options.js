import styles from "./Options.module.css";

const Options = ({ currentOptions }) => {

    if (currentOptions !== undefined) {
        return (
            <div className={styles.container}>
            <p>Options</p>
            {currentOptions.length > 0 ? currentOptions.map((option) => (
                <p>{option.word}</p>
            )) : false }
        </div>
        )
    }

    return (
        <div className={styles.container}>
            <p>Options</p>
        </div>
    )
}; 

export default Options;