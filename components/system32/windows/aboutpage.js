import React, { useState, useRef } from "react";
import { Rnd } from "react-rnd";
import { useZIndex } from "@/components/Tools/ZIndexContext";

import "/styles/utils/style.module.sass";

const AboutPage = ({ closeWindow }) => {


    // Pour gérer le Z-index
    const { bringToFront, zIndex: globalZIndex } = useZIndex();
    const [zIndex, setZIndex] = useState(globalZIndex);

    const updateZIndex = () => {
        const newZIndex = bringToFront(); // Cette fonction devrait maintenant te retourner et setter le nouveau Z-index global
        setZIndex(newZIndex); // Met à jour le Z-index local avec la nouvelle valeur
    };

    // Fonction pour vérifier la taille de l'écran
    const isMobileScreen = () => window.innerWidth <= 600;

    // Fonction pour centrer la fenêtre
    const getCenterPosition = () => {
        if (isMobileScreen()) {
            // Sur un écran de téléphone, centre la fenêtre
            const windowWidth = window.innerWidth * 0.8; // 80% de la largeur de l'écran
            const windowHeight = window.innerHeight * 0.8; // 80% de la hauteur de l'écran
            const x = (window.innerWidth - windowWidth) / 2;
            const y = (window.innerHeight - windowHeight) / 2;
            return { x, y, width: windowWidth, height: windowHeight };
        } else {
            // Sur un écran de PC, place la fenêtre de manière aléatoire
            const windowWidth = window.innerWidth * 0.5; // 50% de la largeur de l'écran
            const windowHeight = window.innerHeight * 0.5; // 50% de la hauteur de l'écran
            const x = Math.random() * (window.innerWidth - windowWidth);
            const y = Math.random() * (window.innerHeight - windowHeight);
            return { x, y, width: windowWidth, height: windowHeight };
        }
    };

    return (
        <>
            <Rnd
                style={{
                    fontFamily: "Arial, sans-serif",
                    zIndex: zIndex
                }}
                default={{
                    ...getCenterPosition(),
                    width: 350,
                    height: 220,
                }}
                minWidth={350}
                minHeight={220}
                className='window'
                onClick={updateZIndex}
                disableDragging={isMobileScreen()}
                position={isMobileScreen()}
            >
                <div className='title-bar'>
                    <div className='title-bar-text'>About</div>
                    <div className='title-bar-controls'>
                        <button aria-label='Minimize' />
                        <button aria-label='Maximize' />
                        <button
                            aria-label='Close'
                            onClick={closeWindow}
                            onTouchStart={closeWindow}
                        />
                    </div>
                </div>

                <div className='window-body'>
                    <h1>LOADING...</h1>
                </div>

                <div className='status-bar'>
                    <p className='status-bar-field'>About</p>
                    <p className='status-bar-field'>TheMoreUKnow</p>
                    <p className='status-bar-field'>CPU Usage: 55%</p>
                </div>
            </Rnd>
        </>
    );
};

export default AboutPage;
