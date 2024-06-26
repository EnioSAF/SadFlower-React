import React, { useState, useEffect } from 'react';

import DiveIn from './OskarWash/DiveIn/DiveIn';
import ClickOnThis from './Enio/ClickOnThis/ClickOnThis';
import MusicCure from './Enio/MusicCure/MusicCure';
import CoolBug4Sell from './OskarWash/CoolBug4Sell/CoolBug4Sell';

const PopUpManager = () => {
    const [popUps, setPopUps] = useState([]);
    const [nextPopUpIn, setNextPopUpIn] = useState(0); // Nouvel état pour suivre le temps restant

    useEffect(() => {
        const schedulePopUps = () => {
            const delay = Math.random() * (1000 * 60 * 10); // Délai aléatoire jusqu'à 10 minutes (10 * 60 * 10) pour 10 secondes
            setNextPopUpIn(delay);

            setTimeout(() => {
                const numberOfPopUps = Math.floor(Math.random() * (5 - 2 + 1)) + 2; // Entre 2 et 10 pop-ups
                const popUpTypes = [DiveIn, ClickOnThis, MusicCure, CoolBug4Sell]; // Array de tes composants pop-up [DiveIn, PopUpA, PopUpB]

                for (let i = 0; i < numberOfPopUps; i++) {
                    setTimeout(() => {
                        const id = Math.random().toString(36).substr(2, 9); // ID unique pour chaque pop-up
                        const RandomPopUpComponent = popUpTypes[Math.floor(Math.random() * popUpTypes.length)]; // Sélection aléatoire d'un type de pop-up
                        setPopUps(prevPopUps => [...prevPopUps, { id, Component: <RandomPopUpComponent key={id} closeWindow={() => handleClosePopUp(id)} /> }]);
                    }, i * 100); // Délai court entre chaque pop-up
                }

                schedulePopUps();
            }, delay);
        };

        schedulePopUps();
    }, []);


    const handleClosePopUp = (id) => {
        setPopUps(prevPopUps => prevPopUps.filter(popUp => popUp.id !== id));
    };

    useEffect(() => {
        // Met à jour le timer chaque seconde pour l'affichage
        const interval = setInterval(() => {
            setNextPopUpIn(prevTime => (prevTime > 0 ? prevTime - 1000 : 0));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            {popUps.map(popUp => popUp.Component)}
        </div>
    );
};

export default PopUpManager;
