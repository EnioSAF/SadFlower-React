import React, { useState, useEffect } from 'react';
import DiveIn from './OskarWash/DiveIn/DiveIn';

const PopUpManager = () => {
    const [popUps, setPopUps] = useState([]);
    const [nextPopUpIn, setNextPopUpIn] = useState(0); // Nouvel état pour suivre le temps restant

    useEffect(() => {
        const schedulePopUps = () => {
            const delay = Math.random() * (10 * 60 * 1000); // Délai aléatoire avant de montrer les pop-ups, jusqu'à 10 minutes
            setNextPopUpIn(delay); // Met à jour le timer de test

            setTimeout(() => {
                const numberOfPopUps = Math.floor(Math.random() * (10 - 2 + 1)) + 2; // Entre 2 et 10 pop-ups

                for (let i = 0; i < numberOfPopUps; i++) {
                    setTimeout(() => {
                        const id = Math.random().toString(36).substr(2, 9); // ID unique pour chaque pop-up
                        setPopUps(prevPopUps => [...prevPopUps, { id, Component: <DiveIn key={id} closeWindow={() => handleClosePopUp(id)} /> }]);
                    }, i * 100); // Un délai très court entre chaque pop-up, ici 100ms
                }

                // Planifie le prochain groupe de pop-ups après un espace d'au moins 10 minutes
                schedulePopUps();
            }, delay);
        };

        // Démarrage initial
        schedulePopUps();

        // Pas de nettoyage spécifique nécessaire ici car les timeouts déclenchent leur propre nettoyage via `setPopUps`
    }, []);

    useEffect(() => {
        // Met à jour le timer chaque seconde pour l'affichage
        const interval = setInterval(() => {
            setNextPopUpIn(prevTime => (prevTime > 0 ? prevTime - 1000 : 0));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleClosePopUp = (id) => {
        setPopUps(prevPopUps => prevPopUps.filter(popUp => popUp.id !== id));
    };

    // Le bouton pour tester l'ouverture d'un pop-up reste inchangé
    const handleShowPopUp = () => {
        const newPopUp = {
            id: Math.random().toString(36).substr(2, 9),
            Component: <DiveIn key={Math.random().toString(36).substr(2, 9)} closeWindow={() => handleClosePopUp(Math.random().toString(36).substr(2, 9))} />
        };
        setPopUps([...popUps, newPopUp]);
    };

    return (
        <div>
            {popUps.map(popUp => popUp.Component)}
            <button onClick={handleShowPopUp}>Afficher le pop-up</button>
            <div>Prochain groupe de pop-ups dans : {(nextPopUpIn / 1000).toFixed(0)} secondes</div>
        </div>
    );
};

export default PopUpManager;
