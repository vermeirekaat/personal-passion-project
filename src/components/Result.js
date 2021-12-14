import styles from "./Result.module.css";

import { usersContext } from "../context/Users";
import { useContext } from "react";

const Result = ({ result }) => {
     // eslint-disable-next-line no-unused-vars
     const [users, setUsers] = useContext(usersContext);
     const colors = users[0].colors;
 
     return (
         <div className={styles.container} style={{ borderColor: colors.dark}}>
             <div className={styles.inside} style={{ borderColor: colors.reg}}>
 
                 {result !== "" ? 
                 <p className={styles.text} style={{ color: colors.reg}}>{result}</p> : 
                 <p className={styles.text} style={{ color: colors.reg}}>Result</p>}
 
             </div>
         </div>
     )
}; 

export default Result;