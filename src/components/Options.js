import styles from "./Options.module.css";

const Options = ({ currentOptions }) => {

    // console.log(currentOptions);

    return(
        <div className={styles.container}>
            <p>Options</p>
            {/* {currentOptions.length > 0 ? currentOptions.map((option) => (
                <ol>{option}</ol>
            )) : false } */}
        </div>
    )
}; 

export default Options;