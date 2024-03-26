import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from "styles/system32/applications/SadGotchu/tamagotchi.module.sass";

const TamagotchiCore = ({ toggleView, isMenuVisible }) => {
    const [stage, setStage] = useState('oeuf'); // Commence au stade oeuf
    const [age, setAge] = useState(0); // Âge en jours
    const [hunger, setHunger] = useState(50);
    const [happiness, setHappiness] = useState(50);
    const [sleepiness, setSleepiness] = useState(50);

    // Sprites pour chaque stade
    const sprites = {
        oeuf: '/SadGotchu/tamas/egg(enio).png',
        bébé: '/SadGotchu/tamas/baby(enio).png',
        enfant: '/SadGotchu/tamas/child(enio).png',
        ado: '/SadGotchu/tamas/ado thug sadgotchu.png',
        adulte: '/SadGotchu/tamas/adult(enio-mametchi).png',
        vieux: '/SadGotchu/tamas/old(enio-tama).png',
        mort: '/SadGotchu/tamas/baddeath(enio).png',
    };

    // Un an dans la vie du Tamagotchi équivaut à 1 minute en temps réel
    const oneYearInMilliseconds = 60000; // 60 000 millisecondes = 1 minute

    useEffect(() => {
        const evolutionInterval = setInterval(() => {
            setAge(prevAge => prevAge + 1); // Simule le passage d'un an

            // Mise à jour du stade basée sur l'âge actuel
            if (age < 3) setStage('oeuf');
            else if (age >= 3 && age < 5) setStage('bébé');
            else if (age >= 5 && age < 13) setStage('enfant');
            else if (age >= 13 && age < 21) setStage('ado');
            else if (age >= 21 && age < 60) setStage('adulte');
            else if (age >= 60 && age < 90) setStage('vieux');
            else if (age >= 100) setStage('mort');
            // Tu peux ajouter plus de conditions ici pour d'autres stades

        }, oneYearInMilliseconds); // Change l'âge toutes les minutes

        return () => clearInterval(evolutionInterval);
    }, [age]);

    // Fonctions d'interaction
    const feed = () => setHunger(Math.max(0, hunger - 30));
    // Ajoute d'autres fonctions comme jouer ou dormir ici

    return (
        <div className={styles.tamagotchiCore}>
            {!isMenuVisible ? (
                <Image
                    src={sprites[stage]}
                    alt="Tamagotchi"
                    width={447}
                    height={360}
                    onDragStart={(e) => e.preventDefault()}
                />
            ) : (
                <div className={styles.tamagotchiMenu}>
                    <p>Stade: {stage}</p>
                    <p>Âge: {age} ans</p>
                    <p>Faim: {hunger}%</p>
                    <p>Bonheur: {happiness}%</p>
                    <button onClick={feed}>Nourrir</button>
                    {/* Ajoute d'autres boutons pour les interactions ici */}
                </div>
            )}
        </div>
    );
};

export default TamagotchiCore;
