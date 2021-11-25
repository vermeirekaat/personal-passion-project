import React, { useEffect } from "react";
import styles from "./Avatar.module.css";
import pirate from "../img/pirate.jpeg";

const Avatar = ({ socket }) => {

    const dialogue = {
        captain: [
            {
                text: "Ahoy maatje, welkom op het Schip van Morse! <br></br> Help je mee om de schat op te halen op het eiland?", 
                button: true,
                topic: "",
                arduino: false,
            },
            {
                text: "Je bent de kapitein en het is jouw taak om het schip in de juiste richting te sturen door boodschappen te sturen naar de matroos. <br></br> Je krijgt drie levens om de route te voltooien.", 
                button: true,
                topic: "Lives",
                arduino: false,
            }, 
            {
                text: "De boodschap die je zal versturen is in morse code. <br></br> Dit is een verzameling van bolletjes en streepjesdie de letters voorstellen. <br></br> In het onderste venster kan je een overzicht vinden dat je hiermee kan helpen.", 
                button: true, 
                topic: "CheatSheet",
                arduino: false,
            }, 
            {
                text: "In dit scherm zal je zien welke route het schip moet afleggen. <br></br> Het is aan jou om te communiceren naar de matroos in welke richting het schip moet varen. <br></br> Deze boodschap zal je doorgeven in morse code.",
                button: true,
                topic: "Route",
                arduino: false,
            }, 
            {
                text: "Laten we eens oefen om de morse code te vormen. <br></br> De code die je vormt kan je in onderstaand scherm zien. <br></br> Vorm de code om <span>links</span> te spellen, want dat is de richting die wordt aangegeven. <br></br> Gebruik de knoppen om de juiste combinatie te maken van bollen en strepen.",
                button: false,
                topic: "Morse", 
                arduino: true,
            }, 
            {
                text: "Goed zo, je eerste morse code heb je kunnen vormen! <br></br> In dit venster kan je zien of het al dan niet gelukt is om de code door te sturen en of de matroos het juist heeft ontcijferd.",
                button: true, 
                topic: "Result", 
                arduino: false, 
            }, 
            {
                text: "Tijdens het varen zal je ook enkele obstakels tegenkomen. <br></br> De obstakels zal je zien in onderstaand venster. <br></br> Het is jouw taak om de naam van het obstakel door te geven aan de matroos die het zal ontcijferen om het obstakel te vermijden", 
                button: true, 
                topic: "Obstacle", 
                arduino: false,
            }, 
            {
                text: "Nu ben je helemaal klaar om aan het spel te beginnen. <br></br> Ahoy, veel succes!", 
                button: true, 
                topic: "", 
                arduino: false,
            },
        ], 
        sailor: [
            {
                text: "Ahoy maatje, welkom op het Schip van Morse! <br></br> Help je mee om de schat op te halen op het eiland?", 
                button: true,
                topic: "",
                arduino: false,
            },
            {
                text: "Je bent de matroos en het is jouw taak om het schip in de juiste richting te sturen. <br></br> Je krijgt 3 levens om de route te voltooien", 
                button: true,
                topic: "Lives",
                arduino: false,
            }, 
            {
                text: "Je zal van de kapitein een boodschap krijgen in morse code. Dit is een combinatie van bollen en strepen die de letters voorstellen. <br></br> In het onderste venster kan je een overzicht vinden dat je hiermee kan helpen.", 
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
                text: "Opgepast, je krijgt een boodschap van de kapitein. <br></br> Dit is de morse code voor <span>links</span>. <br></br> Draai het stuur naar de juiste kant om verder te gaan.", 
                button: false,
                topic: "Morse",
                arduino: true,
            }, 
            {
                text: "Goed zo, dat heb je al goed gedaan! <br></br> In het onderste venster kan je altijd het resultaat zien van je actie, of die al dan niet gelukt is.", 
                button: true,
                topic: "Result",
                arduino: false,
            }, 
            {
                text: "Tijdens het varen zal je ook enkele obstakels tegenkomen. Het is jouw taak om deze te ontwijken. <br></br> Je kan dit doen door de boodschap te ontcijferen zoals in de vorige stap. <br></br> Om je te helpen krijg je drie verschillende opties te zien in onderstaand venster. <br></br> Druk één, twee of drie keer op de knop om het juiste antwoord te kiezen.", 
                button: true,
                topic: "",
                arduino: false,
            }, 
            {
                text: "Goed zo, nu ben je helemaal klaar om aan het spel te beginnen. <br></br> Ahoy, veel succes!", 
                button: true,
                topic: "",
                arduino: false,
            }
        ]
    };

    useEffect(() => {
        
    }, [])
    console.log(dialogue.captain);
    console.log(dialogue.sailor);

    return (
        <div className={styles.container}>
            <img className={styles.avatar} src={pirate} alt="Avatar"/>

            <div className={styles.captionContainer}>
                <p className={styles.caption}>Ahoy maatje, welkom op het Schip van Morse! <br></br>Help je mee om de schat op te halen op het eiland?</p>
                <button className={styles.next}>&#10145;</button>
            </div>
        </div>
    )
};

export default Avatar;