import styles from "./Settings.module.css";

import ledAsset from "./../assets/light-off.svg";
import soundOn from "./../assets/sound-on.svg";
import soundOff from "./../assets/sound-off.svg";

const Settings = ({ ledState, soundState, led, sound }) => {

    // const [led, setLed] = useState(true);
    // const [sound, setSound] = useState(true);

    console.log(led);
    console.log(sound);
    const handleState = (setting) => {
        if (setting === "led") {
            // setLed(!led);
            ledState(!led);
        } else if (setting === "sound") {
            // setSound(!sound);
            soundState(!sound);
        }
    }
    
    const soundAsset = {
        true: soundOn,
        false: soundOff,
    }
    
    return (
        <div className={styles.container}>
            <div className={styles.setting} onClick={() => handleState("led")} style={{ width: "3rem", height: "3rem", borderColor: "white", display: "flex", justifyContent: "center", alignItems: "center"}}>
                <img className={styles.svg} alt="led-icon"src={ledAsset} style={{ width: "1.5rem", padding: ".2rem"}}/>
            </div>
            <div className={styles.setting} onClick={() => handleState("sound")} style={{ width: "3rem", height: "3rem", borderColor: "white", display: "flex", justifyContent: "center", alignItems: "center"}}>
                <img className={styles.svg} alt="sound-icon"src={soundAsset[sound]} style={{ width: "1.5rem", padding: ".2rem"}}/>
            </div>
        </div>
    )
};

export default Settings;