import React from "react";
import "98.css";

const SimpleWindow = () => {
    return (
        <div style={{ width: 300 }} className="window">
            <div className="title-bar">
                <div className="title-bar-text">Ma Super Fenêtre</div>
                <div className="title-bar-controls">
                    <button aria-label="Minimize" />
                    <button aria-label="Maximize" />
                    <button aria-label="Close" />
                </div>
            </div>

            <div className="window-body">
                <p style={{ textAlign: "center" }}>Contenu de la fenêtre ici</p>
            </div>
        </div>
    );
};

export default SimpleWindow;