import React, { useState } from "react";
import { Rnd } from "react-rnd";

import GitHubCalendar from "react-github-calendar";
import { PixelArtCard } from "react-pixelart-face-card";
import { Tilt } from 'react-next-tilt';
import { Parallax, ParallaxLayer } from "@react-spring/parallax";

import SkillCard from "./WhoAmI/SkillCard";
import ChatGPTModule from "./WhoAmI/ChatGPTModule";
import TimeLineEnio from "./WhoAmI/VerticalTimeline";

import "98.css";
import "/styles/system32/windows/window.sass";
import "/styles/system32/windows/whoami.sass";
import "react-vertical-timeline-component/style.min.css";

const Whoami = ({ closeWindow, onClick, zIndex, username }) => {
  const [maxTokens, setMaxTokens] = useState(); //Change ici le nombre de token par session

  // - Fonction pour vérifier la taille de l'écran
  const isMobileScreen = () => window.innerWidth <= 600;

  // Fonction pour centrer la fenêtre
  const getCenterPosition = () => {
    if (isMobileScreen()) {
      // Sur un écran de téléphone, centre la fenêtre
      const windowWidth = window.innerWidth * 0.8; // 80% de la largeur de l'écran
      const windowHeight = window.innerHeight * 0.8; // 80% de la hauteur de l'écran
      const x = (window.innerWidth - windowWidth) / 2;
      const y = (window.innerHeight - windowHeight) / 2;
      return { x, y, width: windowWidth, height: windowHeight };
    } else {
      // Sur un écran de PC
      const windowWidth = window.innerWidth * 0.5; // 50% de la largeur de l'écran
      const windowHeight = window.innerHeight * 0.5; // 50% de la hauteur de l'écran
      const xOffset = 100; // Petit décalage horizontal
      const yOffset = -180; // Petit décalage vertical
      const x = (window.innerWidth - windowWidth) / 2 + xOffset;
      const y = (window.innerHeight - windowHeight) / 2 + yOffset;
      return { x, y, width: windowWidth, height: windowHeight };
    }
  };

  return (
    <>
      <Rnd
        style={{
          zIndex: zIndex,
        }}
        default={{
          ...getCenterPosition(),
          width: 750,
          height: 700,
        }}
        minWidth={350}
        minHeight={220}
        className={`window`}
        onClick={onClick}
        position={isMobileScreen()}
        disableDragging={isMobileScreen()}>
        <div className='title-bar'>
          <div className='title-bar-text'>WhoAmI</div>
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
          <div className="titre-whoami">
            <h3>Who Am I</h3>
          </div>
          <div className='sections-container'>
            <Parallax className="Parallax" pages={3}>
              <ParallaxLayer
                className="Presentations"
                speed={1}
              >
                <Tilt
                  scale={1.05}
                  spotGlareColor="#febfff"
                  borderRadius="20%"
                  gyroMaxAngleX={50}
                  gyroMaxAngleY={50}
                >
                  <div className='ProfilePicture'>
                    <PixelArtCard
                      size={100}
                      color="#7f85e1"
                      hoverColor="#000000"
                    >
                      <PixelArtCard.Hair value="none" color="#ff0000" />
                      <PixelArtCard.HeadAccessory value="head-accessory-5" color="#e38cc8" />
                      <PixelArtCard.Eyes value="eyes-1" color="#322006" />
                      <PixelArtCard.EyesAccessory value="eyes-accessory-5" color="#cac77d" />
                      <PixelArtCard.EarAccessory value="none" color="#01364e" />
                      <PixelArtCard.Nose value="nose-1" />
                      <PixelArtCard.Beard value="beard-5" />
                      <PixelArtCard.Mouth value="mouth-1" color="#ed0dba" />
                      <PixelArtCard.MouthAccessory value="none" color="#d3ab53" />
                      <PixelArtCard.NeckAccessory value="neck-accessory-5" color="#117486" />
                    </PixelArtCard>
                  </div>
                </Tilt>
                <div className='AboutMe'>
                  <p>
                    {`
                    Je m'appelle Enio SADFLOWER, j'ai 25 ans et j'habite à Villeurbanne. Je suis un grand
                    passionné d'informatique et d'arts depuis tout petit, je suis également musicien (6 années
                    de conservatoire et quelques concerts à mon actif [au FIL de Saint Etienne par exemple]).
                    Sociable, j'aime travailler dans la bonne humeur et dans l'entente de tous. Je sais être force
                    de proposition si l'on me le demande et n'hésite pas à collaborer avec mes collègues pour
                    atteindre nos objectifs.
                    `}
                  </p>
                </div>
                <ChatGPTModule />
              </ParallaxLayer>
              <ParallaxLayer
                className="section-experience"
                offset={1} d
                speed={0.2}
              >
                <div className="SkillCardContainer">
                  <Tilt>
                    <SkillCard
                      title="HTML"
                      levels={[90, 80, 70]}
                      description="Maîtrise de HTML, création de structures de page, etc."
                      illustration="/Photo/13.png"
                    />
                  </Tilt>
                  <Tilt>
                    <SkillCard
                      title="HTML"
                      levels={[90, 80, 70]}
                      description="Maîtrise de HTML, création de structures de page, etc."
                      illustration="/Photo/13.png"
                    />
                  </Tilt>
                  <Tilt>
                    <SkillCard
                      title="HTML"
                      levels={[90, 80, 70]}
                      description="Maîtrise de HTML, création de structures de page, etc."
                      illustration="/Photo/13.png"
                    />
                  </Tilt>
                  <Tilt>
                    <SkillCard
                      title="HTML"
                      levels={[90, 80, 70]}
                      description="Maîtrise de HTML, création de structures de page, etc."
                      illustration="/Photo/13.png"
                    />
                  </Tilt>
                  <Tilt>
                    <SkillCard
                      title="HTML"
                      levels={[90, 80, 70]}
                      description="Maîtrise de HTML, création de structures de page, etc."
                      illustration="/Photo/13.png"
                    />
                  </Tilt>
                </div>
              </ParallaxLayer>
              <ParallaxLayer
                className="Parcours"
                offset={2}
                speed={1}
              >
                {/* <div className='GitCalendar'>
                    <h2>Git Activity</h2>
                    <GitHubCalendar
                      username='EnioSAF'
                      year={2024}
                      showWeekdayLabels='true'
                      weekStart='1'
                      maxLevel='4'
                      colorScheme='dark'
                    />
                    <a href='https://github.com/EnioSAF/' target='_blank'>
                      <p color='green'>GitHub</p>
                    </a>
                  </div> */}
                <TimeLineEnio />
              </ParallaxLayer>
            </Parallax>
          </div>
        </div>

        <div className='status-bar'>
          <p className='status-bar-field'>AboutMe</p>
          <p className='status-bar-field'>Slide 1</p>
          <p className='status-bar-field'>CPU Usage: 14%</p>
        </div>
      </Rnd >
    </>
  );
};

export default Whoami;
