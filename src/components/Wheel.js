import styles from "./Wheel.module.css";
import { usersContext } from "../context/Users";
import { useContext, useState } from "react";

import steeringWheel from "./../assets/stuur.svg";

const Wheel = () => {
     // eslint-disable-next-line no-unused-vars
     const [users, setUsers] = useContext(usersContext);
     const colors = users[0].colors;

     const [direction, setDirection] = useState();

     const handleDirection = (click) => {
         setDirection(click); 

         setTimeout(() => {
             setDirection("");
         }, 5000);
     }
 
     return (
         <div className={styles.container} style={{ borderColor: colors.dark}}>
             <div onClick={() => handleDirection("links")}className={styles.inside} style={{ borderColor: colors.reg}}>

                { direction === "links" ? <img className={styles.links} alt="steering-wheel" src={steeringWheel}/> : ""}

                { direction === "rechts" ? <img className={styles.rechts} alt="steering-wheel" src={steeringWheel}/> : ""}

                { direction === "" ? <img alt="steering-wheel" src={steeringWheel}/> : ""}

             </div>
         </div>
     )
};

export default Wheel;