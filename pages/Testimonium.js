import React, { useState, useRef } from "react";
import { useZIndex } from "@/components/Tools/ZIndexContext";
import { Rnd } from 'react-rnd';

import "/styles/utils/style.module.sass";
import "98.css";
import styles from 'styles/system32/windows/testimonium.module.sass';

const Testimonium = ({ closeWindow }) => {
    const [inputValue, setInputValue] = useState('');
    const neverGonnaGiveYouUp = "Never gonna give you up, never gonna let you down, never gonna run around and desert you..."; // Continue with the full lyrics

    const handleChange = (e) => {
        const userInput = e.target.value;
        const rickrolledText = userInput.split('').map((char, index) => neverGonnaGiveYouUp[index % neverGonnaGiveYouUp.length]).join('');
        setInputValue(rickrolledText);
    };

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
        <Rnd
            style={{
                zIndex: isMobileScreen() ? 999 : zIndex
            }}
            default={{
                ...getCenterPosition(),
                width: 360,
                height: 385,
            }}
            className='window'
            onClick={updateZIndex}
            disableDragging={isMobileScreen()}
            position={isMobileScreen()}
        >
            <div className='title-bar'>
                <div className='title-bar-text'>Testimonium-amplificandae-studium.exe</div>
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
                <div className={styles.content}>
                    <h2 className={styles.title}>Expiez votre haine</h2>
                    <p className={styles.description}>Vous êtes raciste ? Sexiste ? Homophobe ? Vous avez une haine globale du genre humain et de la difference ?
                    Ecrivez-nous votre temoignage ici. Nous le ferons analyser par nos proffesionnels et nous ferons une joie de partager vos pensées avec notre (et votre) communauté.</p>
                    <textarea
                        className={styles.input}
                        value={inputValue}
                        onChange={handleChange}
                        placeholder="Écrivez votre témoignage ici..."
                    />
                    <div className={styles.buttons}>
                        <button className={styles.button}>Partager sur Facebook</button>
                        <button className={styles.button}>Partager sur Twitter</button>
                    </div>
                </div>
                <div className='status-bar'>
                    <p className='status-bar-field'>TestiMonium</p>
                    <p className='status-bar-field'>HateIsWrong</p>
                    <p className='status-bar-field'>CPU Usage: 42%</p>
                </div>
            </div>
        </Rnd>
    );
};

export default Testimonium;
