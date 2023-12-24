import Image from "next/image";
import React, { useState } from "react";
import config from "@/src/config";
import { Rnd } from "react-rnd";
import styles from '@/styles/utils/style.module.sass'

import "98.css";
import "/styles/system32/windows/window.sass";

const Whoami = ({ articleData, closeWindow, onClick, zIndex }) => {

    // Fonction pour vérifier la taille de l'écran
    const isMobileScreen = () => window.innerWidth <= 600

    // Fonction pour générer une position aléatoire
    const getRandomPosition = () => {
        // Obtient la largeur et la hauteur de la fenêtre
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        // Obtient des coordonnées aléatoires à l'intérieur de l'écran
        const x = Math.floor(Math.random() * (windowWidth - 350)); // 350 est la largeur de la fenêtre
        const y = Math.floor(Math.random() * (windowHeight - 220)); // 220 est la hauteur de la fenêtre

        return { x, y };

        // Fonction pour centrer la fenêtre
        const getInitialPosition = () => ({
            x: isMobileScreen() ? (window.innerWidth - window.innerWidth * 0.9) / 2 : 0,
            y: isMobileScreen() ? (window.innerHeight - window.innerHeight * 0.9) / 2 : 0,
        });
    };

    return (
        <>
            <Rnd
                style={{
                    fontFamily: "Arial, sans-serif",
                    zIndex: zIndex,
                }}
                default={{
                    ...getRandomPosition(), // Utilise la fonction pour définir la position initiale
                    width: 350,
                    height: 220,
                }}
                minWidth={350}
                minHeight={380}
                className="window"
                onClick={onClick}
                position={isMobileScreen()}
                disableDragging={isMobileScreen()}
            >
                <div className="title-bar">
                    <div className="title-bar-text">WhoAmI</div>
                    <div className="title-bar-controls">
                        <button aria-label="Minimize" />
                        <button aria-label="Maximize" />
                        <button aria-label="Close" onClick={closeWindow} onTouch={closeWindow} />
                    </div>
                </div>

                <div className="window-body">

{/* A remplir */}

                </div>
                <div className="status-bar">
                    <p className="status-bar-field">AboutMe</p>
                    <p className="status-bar-field">Slide 1</p>
                    <p className="status-bar-field">CPU Usage: 14%</p>
                </div>
            </Rnd>
        </>
    );
};

export default Whoami;