import React, { useState, useEffect, useRef } from "react";
import Image from 'next/image';
import { Rnd } from "react-rnd";
import { useZIndex } from "@/components/Tools/ZIndexContext";

import { PowerGlitch } from 'powerglitch';

import "/styles/utils/style.module.sass";
import "styles/system32/windows/PopUp/Enio/ClickOnThis/clickonthis.sass";


const ClickOnThis = ({ closeWindow }) => {

    // - Glitch les images
    const faceRef = useRef(null);

    useEffect(() => {
        if (faceRef.current) {
            PowerGlitch.glitch(faceRef.current, {
                playMode: "hover",
                createContainers: false,
                hideOverflow: false,
                timing: {
                    duration: 3950
                },
                glitchTimeSpan: false,
                shake: false,
                slice: {
                    "count": 6,
                    "velocity": 15,
                    "minHeight": 0.02,
                    "maxHeight": 0.15,
                    "hueRotate": true
                },
                pulse: false,
            });
        }
    }, [faceRef]);

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
                cancel=".divein-background, .title-bar-controls button"
            >
                <div className='title-bar' style={titleBarStyle}>
                    <div className='title-bar-text'>CLICKONIT</div>
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
                    <div className="content-clickonthis">
                        <div className="fond-clickonthis">
                            <Image
                                className={'divein-background'}
                                src={'/PopUp/GoodCitizen/background.jpg'}
                                alt='clickonthis-bg'
                                width='941'
                                height='875'
                            />
                        </div>
                        <div className="face-clickonthis" ref={faceRef}>
                            <a
                                href="https://linktr.ee/eniosadflower"
                                target="_blank"
                                rel="noopener noreferrer"
                                onTouchEnd={() => window.open("https://linktr.ee/eniosadflower", "_blank")}
                            >
                                <Image
                                    className={'face-clickonthis'}
                                    src={'/PopUp/GoodCitizen/face.png'}
                                    alt='face-clickonthis'
                                    width='500'
                                    height='400'
                                />
                            </a>
                        </div>
                    </div>
                </div>

                <div className='status-bar' style={statusBarStyle}>
                    <p className='status-bar-field'>CLICKONTHIS</p>
                    <p className='status-bar-field'>CLICK</p>
                    <p className='status-bar-field'>CPU Usage: 853985%</p>
                </div>
            </Rnd>
        </>
    );
};

export default ClickOnThis;