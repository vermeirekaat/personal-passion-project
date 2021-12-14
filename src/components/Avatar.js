import styles from "./Avatar.module.css";
import { useContext } from "react";
import { usersContext } from "../context/Users";

const Avatar = ({ currentNumber, showItem }) => {

    const dialogue = {
        captain: [
            {
                text: "Ahoy maatje, welkom op het Schip van Morse! Help je mee om de schat op te halen op het eiland? Druk op één van de knoppen om verder te gaan.", 
                topic: "Captain",
            },
            {
                text: "Je bent de kapitein en het is jouw taak om het schip in de juiste richting te sturen door boodschappen te sturen naar de matroos. Je krijgt drie levens om de route te voltooien.", 
                topic: "Lives",
            }, 
            {
                text: "De boodschap die je zal versturen is in morse code. Dit is een verzameling van bolletjes en streepjes die de letters voorstellen. In het onderste venster kan je een overzicht vinden dat je hiermee kan helpen.", 
                topic: "Cheatsheet",
            }, 
            {
                text: "In dit scherm zal je zien welke route het schip moet afleggen. Het is aan jou om te communiceren naar de matroos in welke richting het schip moet varen. Deze boodschap zal je doorgeven in morse code.",
                topic: "Route",
            }, 
            {
                text: "Gebruik de knoppen om de juiste combinatie te maken van bollen en strepen. Als je een fout hebt gemaakt, kan je de knop lang indrukken om opnieuw te beginnen.",
                topic: "Morse", 
            }, 
            {
                text: "In dit venster kan je zien of het al dan niet gelukt is om de code door te sturen en of de matroos het juist heeft ontcijferd.",
                topic: "Result", 
            }, 
            {
                text: "Tijdens het varen zal je ook enkele obstakels tegenkomen. De obstakels zal je zien in onderstaand venster. Het is jouw taak om de naam van het obstakel door te geven aan de matroos die het zal ontcijferen om het obstakel te vermijden.", 
                topic: "Obstacle", 
            }, 
            {
                text: "Nu ben je helemaal klaar om aan het spel te beginnen. Ahoy, veel succes!", 
                topic: "Captain", 
            },
        ], 
        sailor: [
            {
                text: "Ahoy maatje, welkom op het Schip van Morse! Help je mee om de schat op te halen op het eiland? Druk op één van de knoppen om verder te gaan.", 
                topic: "Sailor",
            },
            {
                text: "Je bent de matroos en het is jouw taak om het schip in de juiste richting te sturen. Je krijgt 3 levens om de route te voltooien.", 
                topic: "Lives",
            }, 
            {
                text: "Je zal van de kapitein een boodschap krijgen in morse code. Dit is een combinatie van bollen en strepen die de letters voorstellen. In het onderste venster kan je een overzicht vinden dat je hiermee kan helpen.", 
                topic: "Cheatsheet",
            }, 
            {
                text: "In dit venster zal je de boodschap van de kapitein ontvangen. Het is aan jouw om die boodschap te ontcijferen zodat je het schip juist kan besturen.", 
                topic: "Morse",
            }, 
            {
                text: "Wanneer je van richting moet veranderen, draai je het stuur naar de juiste kant.", 
                topic: "Wheel",
            }, 
            {
                text: "In het onderste venster kan je altijd het resultaat zien van je actie, of die al dan niet gelukt is.", 
                topic: "Result",
            }, 
            {
                text: "Tijdens het varen zal je ook enkele obstakels tegenkomen. Het is jouw taak om deze te ontwijken. Je kan dit doen door de boodschap te ontcijferen zoals in de vorige stap. Om je te helpen krijg je drie verschillende opties te zien in onderstaand venster. Druk één, twee of drie keer op de knop om het juiste antwoord te kiezen.", 
                topic: "Options",
            }, 
            {
                text: "Goed zo, nu ben je helemaal klaar om aan het spel te beginnen. Ahoy, veel succes!", 
                topic: "Sailor",
            }
        ]
    };

    // eslint-disable-next-line
    const [users, setUsers] = useContext(usersContext);

    const currentUser = users[0].user;
    const colors = users[0].colors;


    const filteredByKey = Object.fromEntries(Object.entries(dialogue).filter(([key, value]) => key === currentUser) );
    const array = Object.values(filteredByKey);
    const newArray = array[0];

    if (currentNumber < newArray.length) {
        showItem(newArray[currentNumber].topic);
    } else if (currentNumber >= newArray.length) {
        showItem("Game");
        return false;
    }

    return (
        <div className={styles.container} style={{ borderColor: colors.dark}}>
            <div className={styles.inside} style={{ borderColor: colors.reg}}>
                <p className={styles.caption} style={{ color: colors.reg}}>{newArray[currentNumber].text}</p>
            </div>
        </div>
    )
};

export default Avatar;