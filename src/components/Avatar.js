import styles from "./Avatar.module.css";
import { useEffect, useState } from "react";
import pirate from "../img/pirate.jpeg";

const Avatar = ({ player, showItem, socket }) => {

    const dialogue = {
        captain: [
            {
                text: "Ahoy maatje, welkom op het Schip van Morse! Help je mee om de schat op te halen op het eiland?", 
                button: true,
                topic: "Captain",
                arduino: false,
            },
            {
                text: "Je bent de kapitein en het is jouw taak om het schip in de juiste richting te sturen door boodschappen te sturen naar de matroos. Je krijgt drie levens om de route te voltooien.", 
                button: true,
                topic: "Lives",
                arduino: false,
            }, 
            {
                text: "De boodschap die je zal versturen is in morse code. Dit is een verzameling van bolletjes en streepjes die de letters voorstellen. In het onderste venster kan je een overzicht vinden dat je hiermee kan helpen.", 
                button: true, 
                topic: "CheatSheet",
                arduino: false,
            }, 
            {
                text: "In dit scherm zal je zien welke route het schip moet afleggen. Het is aan jou om te communiceren naar de matroos in welke richting het schip moet varen. Deze boodschap zal je doorgeven in morse code.",
                button: true,
                topic: "Route",
                arduino: false,
            }, 
            {
                text: "Laten we eens oefenen om de morse code te vormen. De code die je vormt kan je in onderstaand scherm zien. Vorm de code om links te spellen, want dat is de richting die wordt aangegeven. Gebruik de knoppen om de juiste combinatie te maken van bollen en strepen.",
                button: false,
                topic: "Morse", 
                arduino: true,
            }, 
            {
                text: "Goed zo, je eerste morse code heb je kunnen vormen! In dit venster kan je zien of het al dan niet gelukt is om de code door te sturen en of de matroos het juist heeft ontcijferd.",
                button: true, 
                topic: "Result", 
                arduino: false, 
            }, 
            {
                text: "Tijdens het varen zal je ook enkele obstakels tegenkomen. De obstakels zal je zien in onderstaand venster. Het is jouw taak om de naam van het obstakel door te geven aan de matroos die het zal ontcijferen om het obstakel te vermijden", 
                button: true, 
                topic: "Obstacle", 
                arduino: false,
            }, 
            {
                text: "Nu ben je helemaal klaar om aan het spel te beginnen. Ahoy, veel succes!", 
                button: true, 
                topic: "End", 
                arduino: false,
            },
        ], 
        sailor: [
            {
                text: "Ahoy maatje, welkom op het Schip van Morse! Help je mee om de schat op te halen op het eiland?", 
                button: true,
                topic: "Sailor",
                arduino: false,
            },
            {
                text: "Je bent de matroos en het is jouw taak om het schip in de juiste richting te sturen. Je krijgt 3 levens om de route te voltooien", 
                button: true,
                topic: "Lives",
                arduino: false,
            }, 
            {
                text: "Je zal van de kapitein een boodschap krijgen in morse code. Dit is een combinatie van bollen en strepen die de letters voorstellen. In het onderste venster kan je een overzicht vinden dat je hiermee kan helpen.", 
                button: true,
                topic: "CheatSheet",
                arduino: false,
            }, 
            {
                text: "In dit venster zal je de boodschap van de kapitein ontvangen. Het is aan jouw om die boodschap te ontcijferen zodat je het schip juist kan besturen.", 
                button: true,
                topic: "Morse",
                arduino: false,
            }, 
            {
                text: "Opgepast, je krijgt een boodschap van de kapitein. Dit is de morse code voor links. Draai het stuur naar de juiste kant om verder te gaan.", 
                button: false,
                topic: "Morse",
                arduino: true,
            }, 
            {
                text: "Goed zo, dat heb je al goed gedaan! In het onderste venster kan je altijd het resultaat zien van je actie, of die al dan niet gelukt is.", 
                button: true,
                topic: "Result",
                arduino: false,
            }, 
            {
                text: "Tijdens het varen zal je ook enkele obstakels tegenkomen. Het is jouw taak om deze te ontwijken. Je kan dit doen door de boodschap te ontcijferen zoals in de vorige stap. Om je te helpen krijg je drie verschillende opties te zien in onderstaand venster. Druk één, twee of drie keer op de knop om het juiste antwoord te kiezen.", 
                button: false,
                topic: "Obstacle",
                arduino: true,
            }, 
            {
                text: "Goed zo, nu ben je helemaal klaar om aan het spel te beginnen. Ahoy, veel succes!", 
                button: true,
                topic: "End",
                arduino: false,
            }
        ]
    };

    const filteredByKey = Object.fromEntries(Object.entries(dialogue).filter(([key, value]) => key === player) );
    const array = Object.values(filteredByKey);
    const newArray = array[0];

    const [amount, setAmount] = useState(0);

    useEffect(() => {
        if (amount < newArray.length) {
            showItem(newArray[amount].topic);
        }
        socket?.emit("currentStep", amount);
    }, [showItem, newArray, amount, socket]);

    const handleKeyDown = (e) => {
        if (e.key === "x") {
            setAmount(amount + 1);
        }
    };

    if (amount >= newArray.length) {
        return (
            <div className={styles.container}>
            <img className={styles.avatar} src={pirate} alt="Avatar"/>

            <div className={styles.captionContainer}>
                <p className={styles.caption}> Start Game</p>
            </div>
        </div>
        )
    }

    return (
        <div className={styles.container}>
            <img className={styles.avatar} src={pirate} alt="Avatar"/>

            <div className={styles.captionContainer}>
                <p className={styles.caption}>{newArray[amount].text}</p><p>{newArray[amount].topic}</p>
                {newArray[amount].button === true ? <button className={styles.next} onClick={() => setAmount(amount + 1)}>&#10145;</button> : <input readOnly value="&#9747;" onKeyPress={handleKeyDown}></input>} 
            </div>
        </div>
    )
};

export default Avatar;