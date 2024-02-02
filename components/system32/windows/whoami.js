import React, { useState, useEffect } from "react";
import { Rnd } from "react-rnd";

import GitHubCalendar from "react-github-calendar";
import { PixelArtCard } from "react-pixelart-face-card";
import { Tilt } from 'react-next-tilt';
import { Parallax, ParallaxLayer } from "@react-spring/parallax";

import SkillCard from "./WhoAmI/SkillCard";
import ChatGPTModule from "./WhoAmI/ChatGPTModule";
import TimeLineEnio from "./WhoAmI/VerticalTimeline";

import "/styles/styles.sass";
import "98.css";
import "/styles/system32/windows/window.sass";
import "/styles/system32/windows/whoami.sass";
import "react-vertical-timeline-component/style.min.css";

const Whoami = ({ closeWindow, onClick, zIndex, username }) => {
  const [maxTokens, setMaxTokens] = useState(); //Change ici le nombre de token par session

  // - Pour les particules
  const [init, setInit] = useState(false);
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadFull(engine);
      setInit(true); // Indique que l'initialisation est terminée et que les particules peuvent être rendues
    });
  }, []);

  // Pour le loading :

  if (!init) {
    return <div>Loading particles...</div>; // Affiche un loader ou un fallback tant que les particules ne sont pas prêtes
  }

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
            <Parallax className="Parallax" pages={4}>
              <ParallaxLayer
                className="section-presentation"
                speed={1}
                factor={2}
              >
                <Particles options={retroGamingParticles} />
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
                  <h4>{`Bonjour,`}</h4>
                  <p>{`Je me présente, Enio SADFLOWER, 25 ans, un mélange de passion pour l'informatique, d'art, et une dévotion pour la musique nourrie par six années de conservatoire et des concerts qui ont marqué mon esprit, notamment au FIL de Saint Etienne. De nature sociable, j'aime vraiment le travail dans une équipe soudée et complice.`}</p>
                  <p>{`Mon histoire avec la tech démarre dès l'enfance, bercé par l'univers parental geek qui m'entoure. Ma première console en main, je plonge dans le monde du codage avec le BASIQUE sur Amstrad CPC, débouchant sur la création de mon premier jeu Snake (recopier de la Sainte Bible). Cette curiosité insatiable me pousse à expérimenter, bidouiller et, avouons-le, sacrifier quelques gadgets électroniques sur l'autel de l'apprentissage. Malgré un parcours professionnel enrichissant en tant que Technicien Informatique, c'est dans le développement web que je trouve ma véritable vocation, carrefour parfait entre ma soif de technologie et ma créativité artistique.`}</p>
                  <p>{`Mon voyage musical et professionnel, ponctué d'expériences diverses, de l'Escape Game à la technicité au sein de structures reconnues comme un CHU et EDF RTE, m'a enseigné l'importance du travail en équipe et de la cohésion. La musique, quant à elle, a aiguisé ma sensibilité artistique et la rigueur, essentielle dans le monde du développement web où l'esthétique et la fonctionnalité doivent fusionner harmonieusement.`}</p>
                  <p>{`Aujourd'hui, je m'oriente vers le web développement, désireux de lier ma passion pour l'informatique à cette créativité que je puisse dans l'art, la musique et mes univers. Parfaitement bilingue grâce à des expériences à l'international, dont un séjour marquant à New York, je suis prêt à m'engager dans le défi du numérique, armé de ma sociabilité et d'une volonté de contribuer activement à des projets stimulants.`}</p>
                  <p>{`Je suis Enio, et je suis ici pour apporter ma pierre à l'édifice d'internet, en mêlant technique, art, musique et innovation.`}</p>
                  <div className='GitCalendar'>
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
                  </div>
                </div>
              </ParallaxLayer>
              <ParallaxLayer
                className="section-chatGPT"
                offset={1}
                speed={1.2}
                factor={1}
              >
                <Particles options={matrixParticles} />
                <div className="ChatGPT-Explanation">
                  <p>{`Si tu as des questions supplémentaires sur ma vie, mon parcours, le site ou quoi que ce toi !
                Tu peux discuter avec mon assistant virtuel juste en dessous !`}</p>
                </div>
                <ChatGPTModule />
              </ParallaxLayer>
              <ParallaxLayer
                className="section-experience"
                offset={2}
                speed={0.2}
                factor={0.8}
              >
                <div className="SkillCardContainer">
                  <Tilt>
                    <SkillCard
                      title="HUMAN"
                      levels={[90, 80, 100]}
                      labels={["Sociable", "Humour", "Passion"]}
                      description="Maîtrise de HTML, création de structures de page, etc."
                      illustration="/Photo/13.png"
                    />
                  </Tilt>
                  <Tilt>
                    <SkillCard
                      title="COMPUTER"
                      levels={[90, 50, 90, 60]}
                      labels={["Front-End", "Backend", "Software", "HardWare"]}
                      description="Maîtrise de HTML, création de structures de page, etc."
                      illustration="/Photo/13.png"
                    />
                  </Tilt>
                  <Tilt>
                    <SkillCard
                      title="MUSIC"
                      levels={[90, 50]}
                      labels={["MAO (DAW)", "Accoustic"]}
                      description="Maîtrise de HTML, création de structures de page, etc."
                      illustration="/Photo/13.png"
                    />
                  </Tilt>
                </div>
              </ParallaxLayer>
              <ParallaxLayer
                className="section-timeline"
                offset={3}
                speed={1}
              >
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
