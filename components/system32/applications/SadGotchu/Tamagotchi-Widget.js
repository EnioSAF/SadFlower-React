import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import Image from 'next/image';
import { Rnd } from "react-rnd";
import { useZIndex } from "@/components/Tools/ZIndexContext";

import TamagotchiCore from "components/system32/applications/SadGotchu/Tamagotchi-Core.js";

import styles from "styles/system32/applications/SadGotchu/tamagotchi.module.sass";

const TamagotchiWidget = ({ closeWindow }) => {

    // Pour gérer le tamagotchi

    const [isOn, setIsOn] = useState(true);
    const [isButtonMiddlePressed, setIsButtonMiddlePressed] = useState(false);

    const togglePower = () => {
        closeWindow();
    };

    const playClickSound = () => {
        const sounds = [
            '/SadGotchu/clicksounds/click1.mp3',
            '/SadGotchu/clicksounds/click2.mp3',
            '/SadGotchu/clicksounds/click3.mp3',
            '/SadGotchu/clicksounds/click4.mp3',
        ];
        const soundToPlay = sounds[Math.floor(Math.random() * sounds.length)]; // Sélectionne un son aléatoire
        const sound = new Audio(soundToPlay);
        sound.play();
    };

    // Pour gérer les menus
    const [currentMenu, setCurrentMenu] = useState('core'); // 'core', 'stats', 'actions'
    const stage = useSelector(state => state.sadGotchu.stage);
    const isSleeping = useSelector(state => state.sadGotchu.isSleeping);

    const toggleView = () => {
        setCurrentMenu(prevMenu => {
            // Vérifie si le SadGotchu est au stage "oeuf", dort ou est en état final
            if (stage === 'oeuf' || isSleeping ) {
                // Si oui, ne permet pas d'accéder au menu 'actions' et saute directement à 'core' depuis n'importe quel autre menu
                return prevMenu === 'core' ? 'stats' : 'core';
            } else {
                // Sinon, logique de navigation normale
                switch (prevMenu) {
                    case 'core': return 'stats';
                    case 'stats': return 'actions';
                    case 'actions': return 'core';
                    default: return 'core';
                }
            }
        });
    };
    // Pour gérer la fenêtre

    const { bringToFront, zIndex: globalZIndex } = useZIndex();
    const [zIndex, setZIndex] = useState(globalZIndex);

    const updateZIndex = () => {
        const newZIndex = bringToFront();
        setZIndex(newZIndex);
    };

    const isMobileScreen = () => window.innerWidth <= 600;

    const getCenterPosition = () => {
        if (isMobileScreen()) {
            const windowWidth = window.innerWidth * 0.8;
            const windowHeight = window.innerHeight * 0.8;
            const x = (window.innerWidth - windowWidth) / 2;
            const y = (window.innerHeight - windowHeight) / 2;
            return { x, y, width: windowWidth, height: windowHeight };
        } else {
            const windowWidth = window.innerWidth * 0.5;
            const windowHeight = window.innerHeight * 0.5;
            const x = Math.random() * (window.innerWidth - windowWidth);
            const y = Math.random() * (window.innerHeight - windowHeight);
            return { x, y, width: windowWidth, height: windowHeight };
        }
    };

    useEffect(() => {
        const newZIndex = bringToFront();
        setZIndex(newZIndex);
    }, []);

    return (
        <>
            <Rnd
                style={{
                    fontFamily: "Arial, sans-serif",
                    zIndex: zIndex
                }}
                default={{
                    ...getCenterPosition(),
                    width: 286,
                    height: 338,
                }}
                minWidth={286}
                minHeight={338}
                maxWidth={286}
                maxHeight={338}
                className='sadgotchu'
                onClick={updateZIndex}
                disableDragging={isMobileScreen()}
            >
                <div className={styles.tamagotchiWidget}>
                    <Image
                        className={styles.shell}
                        src={isOn ? '/SadGotchu/shell/shell.png' : '/SadGotchu/shell/shell-OFF.png'}
                        alt={isOn ? 'shell' : 'shell-off'}
                        layout='fill'
                        objectFit='cover'
                        onDragStart={(e) => e.preventDefault()}
                    />
                    <img
                        src="/SadGotchu/buttons/button-off.png"
                        alt="On/Off"
                        className={styles.buttonOnOff}
                        onClick={togglePower}
                        onDragStart={(e) => e.preventDefault()}
                        onMouseDown={() => {
                            playClickSound();
                        }}
                    />
                    <img
                        src={isButtonMiddlePressed ? "/SadGotchu/buttons/button-middle(pushed).png" : "/SadGotchu/buttons/button-middle.png"}
                        alt="Middle"
                        className={styles.buttonMiddle}
                        onMouseDown={() => {
                            setIsButtonMiddlePressed(true);
                            playClickSound();
                        }}
                        onMouseUp={() => {
                            setIsButtonMiddlePressed(false);
                            toggleView();
                        }}
                        onMouseLeave={() => setIsButtonMiddlePressed(false)}
                        onDragStart={(e) => e.preventDefault()}
                    />
                    {isOn && (
                        <div>
                            <TamagotchiCore currentMenu={currentMenu} />
                        </div>
                    )}
                </div>
            </Rnd>
        </>
    );
};

export default TamagotchiWidget;
