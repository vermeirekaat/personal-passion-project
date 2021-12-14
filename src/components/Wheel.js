import styles from "./Wheel.module.css";
import { usersContext } from "../context/Users";
import { useContext } from "react";

import steeringWheel from "./../assets/stuur.svg";

const Wheel = ({ currentRotation }) => {
     // eslint-disable-next-line no-unused-vars
     const [users, setUsers] = useContext(usersContext);
     const colors = users[0].colors;

    // const [direction, setDirection] = useState(currentRotation);
 
     return (
         <div className={styles.container} style={{ borderColor: colors.dark}}>
             <div className={styles.inside} style={{ borderColor: colors.reg}}>

                { currentRotation === "" ? <img alt="steering-wheel" src={steeringWheel}/> : ""}
             
                { currentRotation === "links" ? <img className={styles.links} alt="steering-wheel" src={steeringWheel}/> : ""}

                { currentRotation === "rechts" ? <img className={styles.rechts} alt="steering-wheel" src={steeringWheel}/> : ""}

             </div>
         </div>
     )
};

export default Wheel;