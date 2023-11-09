import React, { useState } from "react";
import { Rnd } from "react-rnd";
import "98.css";
import "/styles/system32/window.sass"

const Window = ({ articleData }) => {
    const [zIndex, setZIndex] = useState(1);

    const bringToFront = () => {
        setZIndex(prevZIndex => prevZIndex + 1);
    }

    return (
        <Rnd
            style={{
                border: '2px solid #000',
                fontFamily: 'Arial, sans-serif',
                zIndex: zIndex,
            }}
            default={{
                x: 0,
                y: 0,
                width: 350,
                height: 220,
            }}
            minWidth={350}
            minHeight={50}
            className="window"
            onDragStart={bringToFront} // Met la fenêtre au premier plan dès qu'on commence à la déplacer
            onClick={bringToFront} // Met la fenêtre au premier plan quand on clique dessus
            onResizeStart={bringToFront} // Met la fenêtre au premier plan dès qu'on commence à la redimensionner
        >
            <div className="title-bar">
                <div className="title-bar-text">{articleData.attributes.Title}</div>
                <div className="title-bar-controls">
                    <button aria-label="Minimize" />
                    <button aria-label="Maximize" />
                    <button aria-label="Close" />
                </div>
            </div>

            <div className="window-body">
                <div className="fenetre-article">
                    {articleData && articleData.attributes && (
                        <>
                            <h2>{articleData.attributes.Title}</h2>
                            <hr />
                            <p>{articleData.attributes.Summary}</p>
                        </>
                    )}
                </div>
            </div>
            <div className="status-bar">
                <p className="status-bar-field">{articleData.attributes.Category}</p>
                <p className="status-bar-field">Slide 1</p>
                <p className="status-bar-field">CPU Usage: 14%</p>
            </div>
        </Rnd>
    );
};

export default Window;
