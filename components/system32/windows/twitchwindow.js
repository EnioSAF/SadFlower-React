import React, { useState, useRef, useMemo } from "react";
import { TwitchPlayer } from "react-twitch-embed";
import { TwitchChat } from "react-twitch-embed";
import { Rnd } from "react-rnd";
import styles from "@/styles/utils/style.module.sass";
import twitchwindow from "@/styles/system32/windows/twitchwindow.sass";

const TwitchWindow = ({ closeWindow }) => {
  const [zIndex, setZIndex] = useState(1);
  const embed = useRef();

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

  const twitchPlayer = useMemo(() => {
    return (
      <TwitchPlayer
        channel='EnioSadFlower'
        height={550}
        autoplay
        muted
        onReady={(e) => (embed.current = e)}
      />
    );
  }, []); // Les crochets vides indiquent que le composant doit être mémorisé une seule fois

  const twitchChat = useMemo(() => {
    return <TwitchChat channel='EnioSadFlower' darkMode />;
  }, []); // Les crochets vides indiquent que le composant doit être mémorisé une seule fois

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
        minWidth={1337}
        minHeight={656}
        className='window'
        onMouseDownCapture={bringToFront}
        onDragStart={bringToFront}
        onTouchStart={bringToFront}
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
