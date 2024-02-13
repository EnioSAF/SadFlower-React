import React, { useState, useEffect } from 'react';
import DiveIn from './OskarWash/DiveIn/DiveIn';

const PopUpManager = () => {
    const [showPopUp, setShowPopUp] = useState(false);

    // Pour afficher la pop-up au hasard, tu peux utiliser un effet avec un timeout
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowPopUp(true); // Active la pop-up après un délai
        }, Math.random() * 5000); // Entre 0 et 5 secondes, ajuste comme tu veux

        return () => clearTimeout(timer);
    }, []);

    // Gère le clic pour afficher la pop-up direct
    const handleShowPopUp = () => {
        setShowPopUp(true);
    };

    const handleClosePopUp = () => {
        setShowPopUp(false);
    };

    return (
        <div>
            {showPopUp && <DiveIn closeWindow={handleClosePopUp} />}
            {/* Ajoute ici un bouton ou autre élément déclencheur si tu veux */}
            <button onClick={handleShowPopUp}>Afficher le pop-up</button>
        </div>
    );
};

export default PopUpManager;
