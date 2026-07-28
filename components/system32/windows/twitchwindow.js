import React, { useState, useRef, useMemo } from "react";
import { Rnd } from "react-rnd";
import { useZIndex } from "@/components/Tools/ZIndexContext";

import { TwitchPlayer } from "react-twitch-embed";
import { TwitchChat } from "react-twitch-embed";

import "/styles/utils/style.module.sass";
const TwitchWindow = ({ closeWindow, externalMediaAllowed, onAllowExternalMedia }) => {
  const embed = useRef();

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

  const twitchPlayer = useMemo(() => {
    if (!externalMediaAllowed) {
      return (
        <div className='twitch-consent-prompt'>
          <h2>Contenu externe bloqué</h2>
          <p>Le lecteur Twitch reste désactivé tant que vous ne l’autorisez pas.</p>
          <button type='button' onClick={onAllowExternalMedia}>Autoriser Twitch</button>
        </div>
      );
    }
    return (
      <TwitchPlayer
        channel='EnioSadFlower'
        height={550}
        autoplay
        muted
        onReady={(e) => (embed.current = e)}
      />
    );
  }, [externalMediaAllowed, onAllowExternalMedia]);

  const twitchChat = useMemo(() => {
    if (!externalMediaAllowed) return null;
    return <TwitchChat channel='EnioSadFlower' darkMode />;
  }, [externalMediaAllowed]);

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
        minWidth={1337}
        minHeight={656}
        className='window'
        onMouseDownCapture={updateZIndex}
        onDragStart={updateZIndex}
        onTouchStart={updateZIndex}
      >
        <div className='title-bar'>
          <div className='title-bar-text'>Twitch.tv</div>
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
          <div className='twitch-window-body'>
            <div className='twitch-player'>{twitchPlayer}</div>
            <div className='twitch-chat'>{twitchChat}</div>
          </div>
        </div>

        <div className='status-bar'>
          <p className='status-bar-field'>twitch.tv/eniosadflower</p>
          <p className='status-bar-field'>VideoPlayer</p>
          <p className='status-bar-field'>CPU Usage: 55%</p>
        </div>
      </Rnd>
    </>
  );
};

export default TwitchWindow;
