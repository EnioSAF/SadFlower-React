// TamagotchiCore.jsx
import React, { useState, useEffect } from 'react';

import styles from "styles/system32/applications/SadGotchu/tamagotchi.module.sass";

const TamagotchiMenu = ({ closing }) => {
    const [hunger, setHunger] = useState(50);
    const [happiness, setHappiness] = useState(50);
    const [sleepiness, setSleepiness] = useState(50);

    useEffect(() => {
        const interval = setInterval(() => {
            setHunger(hunger => Math.min(100, hunger + 5));
            setSleepiness(sleepiness => Math.min(100, sleepiness + 5));
            setHappiness(happiness => Math.max(0, happiness - 5));
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    const feed = () => {
        setHunger(Math.max(0, hunger - 30));
        setHappiness(Math.min(100, happiness + 10));
    };

    return (
        <div className={`${styles.tamagotchiMenu} ${closing ? styles.closingAnimation : ''}`}>
            <p>Faim: {hunger}%</p>
            <p>Bonheur: {happiness}%</p>
            <p>Sommeil: {sleepiness}%</p>
            <button onClick={feed}>Nourrir</button>
            {/* Ajouter d'autres boutons pour jouer, dormir, etc. */}
        </div>
    );
};

export default TamagotchiMenu;
