import styles from "./Wheel.module.css";
import { usersContext } from "../context/Users";
import { useContext } from "react";

import steeringWheel from "./../assets/stuur.svg";

const Wheel = () => {
     // eslint-disable-next-line no-unused-vars
     const [users, setUsers] = useContext(usersContext);
     const colors = users.colors;
 
     return (
         <div className={styles.container} style={{ borderColor: colors.dark}}>
             <div className={styles.inside} style={{ borderColor: colors.reg}}>
                <img className={styles.svg} alt="steering-wheel" src={steeringWheel}/>
 
             </div>
         </div>
     )
};

export default Wheel;