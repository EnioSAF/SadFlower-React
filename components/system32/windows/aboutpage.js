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

    const getRandomPosition = () => {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const x = Math.floor(Math.random() * (windowWidth - 350));
        const y = Math.floor(Math.random() * (windowHeight - 220));

        return { x, y };
    };

    return (
        <>
            <Rnd
                style={{
                    fontFamily: "Arial, sans-serif",
                    zIndex: zIndex
                }}
                default={{
                    ...getRandomPosition(),
                    width: 350,
                    height: 220,
                }}
                minWidth={350}
                minHeight={220}
                className='window'
                onMouseDownCapture={updateZIndex}
                onDragStart={updateZIndex}
                onTouchStart={updateZIndex}
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
