import styles from "./CheatSheet.module.css"; 
import { usersContext } from "../context/Users";
import { useContext } from "react";

const CheatSheet = () => {

     // eslint-disable-next-line no-unused-vars
     const [users, setUsers] = useContext(usersContext);
     const colors = users[0].colors;

    const morse = [
        {
            "letter": "A",
            "morse": ".-",
        },
        {
            "letter": "B",
            "morse": "-...",
        },
        {
            "letter": "C",
            "morse": "-.-.",
        },
        {
            "letter": "D",
            "morse": "-..",
        },
        {
            "letter": "E",
            "morse": ".",
        },
        {
            "letter": "F",
            "morse": "..-.",
        },
        {
            "letter": "G",
            "morse": "--.",
        },
        {
            "letter": "H",
            "morse": "....",
        },
        {
            "letter": "I",
            "morse": "..",
        },
        {
            "letter": "J",
            "morse": ".---",
        },
        {
            "letter": "K",
            "morse": "-.-",
        },
        {
            "letter": "L",
            "morse": ".-..",
        },
        {
            "letter": "M",
            "morse": "--",
        },
        {
            "letter": "N",
            "morse": "-.",
        },
        {
            "letter": "O",
            "morse": "---",
        },
        {
            "letter": "P",
            "morse": ".--.",
        },
        {
            "letter": "Q",
            "morse": "--.-",
        },
        {
            "letter": "R",
            "morse": ".-.",
        },
        {
            "letter": "S",
            "morse": "...",
        },
        {
            "letter": "T",
            "morse": "-",
        },
        {
            "letter": "U",
            "morse": "..-",
        },
        {
            "letter": "V",
            "morse": "...-",
        },
        {
            "letter": "W",
            "morse": ".--",
        },
        {
            "letter": "X",
            "morse": "-..-",
        },
        {
            "letter": "Y",
            "morse": "-.--",
        },
        {
            "letter": "Z",
            "morse": "--..",
        },
    ]
    
    return (
        <div className={styles.container} style={{ borderColor: colors.dark}}>
            <div className={styles.inside} style={{ borderColor: colors.reg}}>
                {morse.map((item) => (
                    <p className={styles.letter} key={item.letter} style={{ color: colors.dark}}>{item.letter} <span style={{ color: colors.reg}}>{item.morse}</span></p>
                ))}
            </div>
        </div>
    )
}; 

export default CheatSheet;