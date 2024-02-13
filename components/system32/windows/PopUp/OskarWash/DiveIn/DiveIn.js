import React, { useState, useEffect } from "react";
import Image from 'next/image';
import { Rnd } from "react-rnd";
import { useZIndex } from "@/components/Tools/ZIndexContext";

import "/styles/utils/style.module.sass";
import "styles/system32/windows/PopUp/OskarWash/DiveIn/divein.sass";


const DiveIn = ({ closeWindow }) => {

    // - Fonction pour corruption du cerveau
    useEffect(() => {
        const brain = document.querySelector('.cerveau-divein');
        const applyGlitch = () => {
            const glitchChance = Math.random();
            if (glitchChance < 0.1) { // 10% de chance d'appliquer un glitch
                const x = Math.random() * 5; // Déplacement horizontal aléatoire
                const y = Math.random() * 5; // Déplacement vertical aléatoire
                brain.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
            } else {
                brain.style.transform = 'translate(-50%, -50%)';
            }
        };

        const intervalId = setInterval(applyGlitch, 200); // Applique un léger glitch toutes les 200 ms

        // Pour intensifier le glitch au survol
        brain.addEventListener('mouseenter', () => {
            brain.style.transition = 'none'; // Désactive les transitions pour un effet plus saccadé
            brain.classList.add('glitch-intense'); // Ajoute une classe pour un effet visuel plus intense si nécessaire
        });

        brain.addEventListener('mouseleave', () => {
            brain.style.transition = 'filter 0.5s ease, transform 0.5s ease'; // Réactive les transitions
            brain.classList.remove('glitch-intense'); // Retire la classe d'effet intense
        });

        return () => clearInterval(intervalId);
    }, []); // Le tableau vide [] signifie que cet effet ne s'exécute qu'une fois, après le premier rendu


    // - Pour gérer le Z-index
    const { bringToFront, zIndex: globalZIndex } = useZIndex();
    const [zIndex, setZIndex] = useState(globalZIndex);

    const updateZIndex = () => {
        const newZIndex = bringToFront(); // Cette fonction devrait maintenant te retourner et setter le nouveau Z-index global
        setZIndex(newZIndex); // Met à jour le Z-index local avec la nouvelle valeur
    };

    // Fonction pour vérifier la taille de l'écran
    const isMobileScreen = () => window.innerWidth <= 600;


    // Fonction pour le style des popup sur téléphone
    const mobileScreen = isMobileScreen();
    const titleBarStyle = mobileScreen ? { marginTop: '0px' } : {};
    const statusBarStyle = mobileScreen ? { marginBottom: '42px' } : {};

    // Fonction pour centrer la fenêtre
    const getCenterPosition = () => {
        // Définis ici la taille fixe ou maximale de la fenêtre Rnd si nécessaire
        const rndWidth = 458; // Largeur de la fenêtre Rnd, ajuste selon tes besoins
        const rndHeight = 461; // Hauteur de la fenêtre Rnd, ajuste selon tes besoins

        const maxX = window.innerWidth - rndWidth;
        const maxY = window.innerHeight - rndHeight;

        // Génère une position x aléatoire à l'intérieur des limites
        const xAdjustment = maxX * -1.2; // Ajuste ce pourcentage selon le besoin
        const x = Math.random() * (maxX - xAdjustment);
        // Génère une position y aléatoire et ajuste vers le haut en soustrayant un pourcentage de la hauteur de l'écran
        // Par exemple, soustraire jusqu'à 50% de maxY pour "monter" la fenêtre plus haut sur l'écran
        const yAdjustment = maxY * 2; // Ajuste ce pourcentage selon le besoin
        const y = Math.random() * (maxY - yAdjustment);

        return { x, y, width: rndWidth, height: rndHeight };
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
                }}
                minWidth={458}
                minHeight={461}
                maxWidth={458}
                maxHeight={461}
                className='window'
                onClick={updateZIndex}
            >
                <div className='title-bar' style={titleBarStyle}>
                    <div className='title-bar-text'>DiveIn</div>
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
                    <div className="content-divein">
                        <div className="fond-divein">
                            <Image
                                className={'divein-background'}
                                src={'/PopUp/Oskar-Wash/DiveIn/fond.png'}
                                alt='divein-bg'
                                width='941'
                                height='875'
                            />
                            <div className="boutton-divein">
                                <a
                                    href="https://www.instagram.com/oskarwash"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Image
                                        className={'divein-button'}
                                        src={'/PopUp/Oskar-Wash/DiveIn/button.png'}
                                        alt='divein-button'
                                        width='497'
                                        height='157'
                                    />
                                </a>
                            </div>
                            <div className="cerveau-divein">
                                <a
                                    href="https://www.instagram.com/p/CxA2Xp2Nn3L/?hl=fr&img_index=1"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Image
                                        className={'divein-brain'}
                                        src={'/PopUp/Oskar-Wash/DiveIn/brain.png'}
                                        alt='divein-brain'
                                        width='273'
                                        height='209'
                                    />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='status-bar' style={statusBarStyle}>
                    <p className='status-bar-field'>OskarWash x Enio</p>
                    <p className='status-bar-field'>CLICK</p>
                    <p className='status-bar-field'>CPU Usage: 666%</p>
                </div>
            </Rnd>
        </>
    );
};

export default DiveIn;