import Image from "next/image";
import React, { useState } from "react";
import { useZIndex } from "@/components/Tools/ZIndexContext";
import config from "@/src/config";

import { Rnd } from "react-rnd";
import ReactMarkdown from 'react-markdown';

import styles from "@/styles/utils/style.module.sass";
import "98.css";
import "/styles/system32/windows/window.sass";
import "/styles/system32/windows/Articles/window-contenu.sass";

const Window = ({ articleData, closeWindow, onClick }) => {
  // Fonction pour vérifier la taille de l'écran
  const isMobileScreen = () => window.innerWidth <= 600;

    // Pour gérer le Z-index
    const { bringToFront, zIndex: globalZIndex } = useZIndex();
    const [zIndex, setZIndex] = useState(globalZIndex);

    const updateZIndex = () => {
        const newZIndex = bringToFront(); // Cette fonction devrait maintenant te retourner et setter le nouveau Z-index global
        setZIndex(newZIndex); // Met à jour le Z-index local avec la nouvelle valeur
    };

  // Fonction pour générer une position aléatoire
  const getRandomPosition = () => {
    // Obtient la largeur et la hauteur de la fenêtre
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Obtient des coordonnées aléatoires à l'intérieur de l'écran
    const x = Math.floor(Math.random() * (windowWidth - 350)); // 350 est la largeur de la fenêtre
    const y = Math.floor(Math.random() * (windowHeight - 220)); // 220 est la hauteur de la fenêtre

    return { x, y };
  }

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
        minHeight={220}
        className='window'
        onClick={updateZIndex}
        position={isMobileScreen()}
        disableDragging={isMobileScreen()}
      >
        <div className='title-bar'>
          <div className='title-bar-text'>{articleData.attributes.Title}</div>
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
          <div className='fenetre-article'>
              <div className="window-contenu">
                <h2>{articleData.attributes.Title}</h2>
                <hr />
                <div className="window-resume">
                  <p>{articleData.attributes.Summary}</p>
                </div>
                <hr />
                <ReactMarkdown>{articleData.attributes.Content}</ReactMarkdown>
                <hr />
                <Image
                  className={`${styles.stylepourdetails} mb-50`}
                  src={`${articleData.attributes.FeaturedImage.data.attributes.url}`}
                  alt='6'
                  width='1050'
                  height='387'
                />
              </div>
          </div>
        </div>
        <div className='status-bar'>
          <p className='status-bar-field'>{articleData.attributes.Category}</p>
          <p className='status-bar-field'>ReadMode : on</p>
          <p className='status-bar-field'>CPU Usage: 10%</p>
        </div>
      </Rnd>
    </>
  );
};

export default Window;
