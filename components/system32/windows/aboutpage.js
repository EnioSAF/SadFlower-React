import React, { useState, useRef } from "react";
import { Rnd } from "react-rnd";

import "/styles/utils/style.module.sass";

const AboutPage = ({ closeWindow }) => {
    const [zIndex, setZIndex] = useState(1);

    const bringToFront = () => {
        setZIndex((prevZIndex) => prevZIndex + 1);
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
                    zIndex: zIndex,
                }}
                default={{
                    ...getRandomPosition(),
                    width: 350,
                    height: 220,
                }}
                minWidth={350}
                minHeight={220}
                className='window'
                onMouseDownCapture={bringToFront}
                onDragStart={bringToFront}
                onTouchStart={bringToFront}
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
