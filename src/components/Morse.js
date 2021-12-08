import styles from "./Morse.module.css";
import { useContext } from "react";

import { Context } from "../context/Users";

const Morse = ({ morseInput }) => {

    // eslint-disable-next-line
    const [state, dispatch] = useContext(Context);
    const indexCaptain = state.users.findIndex((user) => user.user === "captain");

    // const [input, setInput] = useState(morseInput);

    if (indexCaptain > -1) {

        return (
            <div className={styles.container}>
                <p>Morse Code</p>
                <p>{morseInput}</p>
                {/* <button onClick={() => setInput([])}>Try Again</button> */}
            </div>
        )
    } else if (indexCaptain === -1 ) {
        // console.log(morseInput);
        return (
            <div className={styles.container}>
                <p>Morse Code - Sailor</p>
                <p>{morseInput}</p>
                {/* <input readOnly onKeyPress={handleSubmitAnswer}></input> */}
            </div>
        )
    };

    return (
        <div className={styles.container}>
            <p>Morse Code - Try</p>
        </div>
    )
}; 

export default Morse;