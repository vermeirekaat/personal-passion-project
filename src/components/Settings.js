import styles from "./Settings.module.css";
import { useState } from "react";
import ledAsset from "./../assets/light-off.svg";
import soundOn from "./../assets/sound-on.svg";
import soundOff from "./../assets/sound-off.svg";

const Settings = ({ setChange }) => {

    // const [led, setLed] = useState(true);
    // const [sound, setSound] = useState(true);
    const [settings, setSettings] = useState({led: true, sound: true});

    const handleState = (setting) => {
        if (setting === "led") {
            // setLed(!led);
            const copy = {...settings};
            copy.led = !settings.led; 
            setSettings(copy);
        } else if (setting === "sound") {
            const copy = {...settings};
            copy.sound = !settings.sound; 
            setSettings(copy);
        };

        setChange(settings);
    }
    
    const soundAsset = {
        true: soundOn,
        false: soundOff,
    }
    
    return (
        <div className={styles.container}>
            <div className={`${settings.led === true ? styles.setting : `${styles.setting} ${styles.opacity}`}`} onClick={() => handleState("led")}>
                <img className={styles.svg} alt="led-icon"src={ledAsset} style={{ width: "1.5rem", padding: ".2rem"}}/>
            </div>
            <div className={`${settings.sound === true ? styles.setting : `${styles.setting} ${styles.opacity}`}`} onClick={() => handleState("sound")}>
                <img className={styles.svg} alt="sound-icon"src={soundAsset[settings.sound]} style={{ width: "1.5rem", padding: ".2rem"}}/>
            </div>
        </div>
    )
};

export default Settings;