import styles from "./Options.module.css";

const Options = ({ currentOptions, getAnswer}) => {

    const handleSubmitAnswer = (e) => {
        if (e.key === "1") {
            getAnswer(currentOptions[0].word);
        } else if (e.key === "2") {
            getAnswer(currentOptions[1].word);
        } else if (e.key === "3") {
            getAnswer(currentOptions[2].word);
        }
    }

    if (currentOptions.length > 0) {
        return (
            <div className={styles.container}>
            <p>Options</p>
            {currentOptions.map((option) => (
                <p key={option.word}>{option.word}</p>
            ))}
            <input readOnly onKeyPress={handleSubmitAnswer}></input>
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