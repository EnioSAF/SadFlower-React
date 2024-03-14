import React, { useState, useEffect } from 'react';

import styles from "styles/system32/applications/Tamagotchi/tamagotchi-core.module.sass";

const Tamagotchi = () => {
    // - Pour gérer le Tamagotchi
    const [hunger, setHunger] = useState(0);
    const [happiness, setHappiness] = useState(100);
    const [sleepiness, setSleepiness] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setHunger(hunger => Math.min(100, hunger + 5));
            setSleepiness(sleepiness => Math.min(100, sleepiness + 5));
            setHappiness(happiness => Math.max(0, happiness - 5));
        }, 10000); // Met à jour toutes les 10 secondes

        return () => clearInterval(interval);
    }, []);

    const feed = () => {
        setHunger(Math.max(0, hunger - 30));
        setHappiness(Math.min(100, happiness + 10));
    };

    const play = () => {
        setHappiness(Math.min(100, happiness + 20));
    };

    const sleep = () => {
        setSleepiness(Math.max(0, sleepiness - 40));
        setHappiness(Math.min(100, happiness + 5));
    };

    return (
        <div className={styles.tamagotchi}>
            <div className={styles.stats}>
                <p>Faim: {hunger}%</p>
                <p>Bonheur: {happiness}%</p>
                <p>Sommeil: {sleepiness}%</p>
            </div>
            <div className={styles.actions}>
                <button onClick={feed}>Nourrir</button>
                <button onClick={play}>Jouer</button>
                <button onClick={sleep}>Dormir</button>
            </div>
        </div>
    );
};

export default Tamagotchi;