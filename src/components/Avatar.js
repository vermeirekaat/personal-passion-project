import styles from "./Avatar.module.css";
import { useContext, useEffect } from "react";
import { usersContext } from "../context/Users";

const Avatar = ({ currentNumber, showItem }) => {

    const dialogue = {
        captain: [
            {
                text: "Ahoy Kapitein, welkom op het Schip van Morse! Help je mee om de schat op te halen op het eiland? Druk op één van de knoppen om verder te gaan. Druk lang op een knop om over te gaan naar het spel.", 
                topic: "Captain",
            },
            {
                text: "Je bent de kapitein en het is jouw taak om de juiste boodschap te sturen naar de matroos. Je krijgt 3 levens om de route te voltooien.", 
                topic: "Lives",
            }, 
            {
                text: "De boodschap die je zal versturen is in morse code. Dit is een verzameling van bolletjes en streepjes die de letters voorstellen. In het onderste venster kan je een overzicht vinden dat je hiermee helpt.", 
                topic: "Cheatsheet",
            }, 
            {
                text: "In dit scherm zal je zien in welke richting het schip moet varen. Het is aan jou om dit te communiceren naar de matroos.",
                topic: "Route",
            }, 
            {
                text: "Gebruik de knoppen om de juiste combinatie te maken van bollen en strepen. Als je een fout hebt gemaakt, kan je één van de knoppen lang indrukken om opnieuw te beginnen.",
                topic: "Morse", 
            }, 
            {
                text: "In dit venster kan je zien of het al dan niet gelukt is om de juiste code door te sturen en of de matroos het juist heeft ontcijferd.",
                topic: "Result", 
            }, 
            {
                text: "Tijdens het varen zal je ook enkele obstakels tegenkomen. Het is jouw taak om de naam van het obstakel door te geven aan de matroos die het zal ontcijferen om het obstakel te vermijden.", 
                topic: "Obstacle", 
            }, 
        ], 
        sailor: [
            {
                text: "Ahoy Matroos, welkom op het Schip van Morse! Help je mee om de schat op te halen op het eiland? Druk op één van de knoppen om verder te gaan. Druk lang op een knop om over te gaan naar het spel.", 
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
                text: "In dit venster zal je de boodschap van de kapitein ontvangen. Het is aan jou om die boodschap te ontcijferen zodat je het schip juist kan besturen.",
                topic: "Morse",
            }, 
            {
                text: "Wanneer je van richting moet veranderen, draai je het stuur naar de juiste kant (links of rechts).", 
                topic: "Wheel",
            }, 
            {
                text: "In het onderste venster kan je altijd het resultaat zien. Of de boodschap juist is van de kapitein en of je de juiste actie hebt gekozen.", 
                topic: "Result",
            }, 
            {
                text: "Tijdens het varen zal je ook enkele obstakels tegenkomen, het is jouw taak om die te ontwijken door de boodschap te ontcijferen. Druk 1, 2 of 3 keer op de knop om het juiste antwoord te kiezen. !OPGELET, om je antwoord te bevestigen moet je langer op de knop drukken!", 
                topic: "Options",
            }, 
        ]
    };

    // eslint-disable-next-line
    const [users, setUsers] = useContext(usersContext);

    const currentUser = users[0].user;
    const colors = users[0].colors;


    const filteredByKey = Object.fromEntries(Object.entries(dialogue).filter(([key, value]) => key === currentUser) );
    const array = Object.values(filteredByKey);
    const newArray = array[0];

    useEffect(() => {
        if (currentNumber < newArray.length) {
            showItem(newArray[currentNumber].topic);
        } else if (currentNumber >= newArray.length) {
            showItem("Game");
        }
    }, [currentNumber, newArray, showItem])



    return (
        <div className={styles.container} style={{ borderColor: colors.dark}}>
            <div className={styles.inside} style={{ borderColor: colors.reg}}>
                <p className={styles.caption} style={{ color: "white"}}>{newArray[currentNumber].text}</p>
            </div>
        </div>
    )
};

export default Avatar;