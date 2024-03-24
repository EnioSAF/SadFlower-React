import React, { useState } from "react";
import Image from 'next/image';
import { Rnd } from "react-rnd";
import { useZIndex } from "@/components/Tools/ZIndexContext";

import TamagotchiCore from "components/system32/applications/Tamagotchi/Tamagotchi-Core.js";
import TamagotchiMenu from "components/system32/applications/Tamagotchi/Tamagotchi-Menu.js";

import styles from "styles/system32/applications/Tamagotchi/tamagotchi.module.sass"

const TamagotchiWidget = ({ closeWindow }) => {

    // Pour gérer le tamagotchi

    const [isOn, setIsOn] = useState(true);
    const [currentView, setCurrentView] = useState('core');
    const [isButtonMiddlePressed, setIsButtonMiddlePressed] = useState(false);

    const togglePower = () => {
        closeWindow();
    };

    const toggleView = () => {
        if (isOn) {
            setCurrentView(currentView => currentView === 'core' ? 'menu' : 'core');
        }
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
                className='sadgotchu'
                onClick={updateZIndex}
                disableDragging={isMobileScreen()}
                position={isMobileScreen()}
            >
                <div className={styles.tamagotchiWidget}>
                    <Image
                        className={styles.shell}
                        src={isOn ? '/SadGotchu/shell.png' : '/SadGotchu/shell-OFF.png'}
                        alt={isOn ? 'shell' : 'shell-off'}
                        layout='fill'
                        objectFit='cover'
                    />
                    <img src="/SadGotchu/button-off.png" alt="On/Off" className={styles.buttonOnOff} onClick={togglePower} />
                    <img
                        src={isButtonMiddlePressed ? "/SadGotchu/button-middle(pushed).png" : "/SadGotchu/button-middle.png"}
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
                    />
                    {isOn && (
                        <div>
                            {currentView === 'core' ? <TamagotchiCore /> : <TamagotchiMenu />}
                        </div>
                    )}
                </div>
            </Rnd>
        </>
    );
};

export default TamagotchiWidget;
