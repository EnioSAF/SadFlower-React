import React, { useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import axios from "axios";

import TypeIt from "typeit-react";
import GitHubCalendar from "react-github-calendar";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import { PixelArtCard } from "react-pixelart-face-card";
import { Tilt } from 'react-next-tilt';
import { Parallax, ParallaxLayer } from "@react-spring/parallax";

import chatGptConfig from "@/components/system32/applications/chatgptconfig";

import "98.css";
import "/styles/system32/windows/window.sass";
import "/styles/system32/windows/whoami.sass";
import "react-vertical-timeline-component/style.min.css";

const Whoami = ({ closeWindow, onClick, zIndex, username }) => {
  // - Pour ChatGPT
  const [output, setOutput] = useState("");
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messageHistory, setMessageHistory] = useState([]);
  const [tokensUsed, setTokensUsed] = useState(null);
  const [maxTokens, setMaxTokens] = useState(); //Change ici le nombre de token par session

  const clearInput = () => {
    setInput("");
  };

  const handleCommand = async () => {
    setMessageHistory((prevHistory) => [
      ...prevHistory,
      { role: "user", content: input },
    ]);
    try {
      const apiUrl = "https://api.openai.com/v1/chat/completions";

      const messages = [
        { role: "system", content: chatGptConfig },
        { role: "user", content: input },
      ];

      setIsTyping(true);

      const apiResponse = await axios.post(
        apiUrl,
        {
          messages,
          max_tokens: maxTokens - tokensUsed, // Limite le nombre de tokens restants
          model: "gpt-3.5-turbo",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_KEY}`,
          },
        },
      );

      setIsTyping(false);

      const gpt3Response = apiResponse.data.choices[0]?.message?.content;
      const usedTokens = apiResponse.data.usage?.total_tokens;
      setOutput(gpt3Response);
      setMessageHistory((prevHistory) => [
        ...prevHistory,
        { role: "assistant", content: gpt3Response },
      ]);

      // Met à jour le nombre de tokens utilisés dans l'état local
      setTokensUsed((prevTokensUsed) => prevTokensUsed + usedTokens);
    } catch (error) {
      console.error("Erreur lors de la requête à l'API GPT-3 :", error.message);

      // Vérifie si la propriété 'response' est définie avant d'y accéder
      if (error.response) {
        console.error("Réponse détaillée de l'API:", error.response.data);
      } else {
        console.error("Aucune réponse détaillée de l'API disponible.");
      }
    }
  };

  const [isInputFocused, setInputFocused] = useState(false);
  const [gifVisible, setGifVisible] = useState(false);

  const handleInputFocus = () => {
    setInputFocused(true);
    setGifVisible(false);
  };

  const handleInputBlur = () => {
    setInputFocused(false);
  };

  const handleOutputDisplay = async () => {
    setGifVisible(true);

    const wordsCount = output.split(" ").length;
    const displayTimeInSeconds = wordsCount * 0.5;

    await new Promise((resolve) =>
      setTimeout(resolve, displayTimeInSeconds * 1000),
    );

    setGifVisible(false);
  };

  useEffect(() => {
    if (output) {
      handleOutputDisplay();
    }
  }, [output]);

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
        className={`window ${output ? "output-visible" : ""} ${input ? "input-focus" : ""}`}
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
                <div className='ChatGPT'>
                  <div className='output-section'>
                    <div className='message-history'>
                      {tokensUsed >= maxTokens ? (
                        <p style={{ color: "red" }}>
                          ERROR: ALL TOKENS ARE USED
                        </p>
                      ) : (
                        <div className='message-history'>
                          {messageHistory.map((message, index) => (
                            <div key={index} className={message.role}>
                              {message.role === "user" && (
                                <>
                                  <p>
                                    <u>
                                      <b>{username ? username : "You"}</b>
                                    </u>
                                    :
                                  </p>
                                  <p>{message.content}</p>
                                </>
                              )}
                              {message.role === "assistant" && (
                                <div className='avatar-message'>
                                  <div className='avatar-image'>
                                    {index === messageHistory.length - 1 ? (
                                      // Utilise l'avatar "/Gif/EnioHeadstill.png" pour le dernier message
                                      <>
                                        {!isInputFocused && !gifVisible && (
                                          <img
                                            src='/Gif/EnioHeadsleepin.png'
                                            alt='EnioHeadsleepin'
                                          />
                                        )}
                                        {gifVisible && (
                                          <img
                                            src='/Gif/EnioHead.gif'
                                            alt='EnioHeadGif'
                                          />
                                        )}
                                        {isInputFocused && (
                                          <img
                                            src='/Gif/EnioHeadstill.png'
                                            alt='EnioHeadstill'
                                          />
                                        )}
                                      </>
                                    ) : (
                                      // Utilise l'avatar "/Gif/EnioHeadsleepin.png" pour les anciens messages
                                      <img
                                        src='/Gif/EnioHeadsleepin.png'
                                        alt='EnioHeadsleepin'
                                      />
                                    )}
                                  </div>
                                  <p>
                                    <u>
                                      <b>Enio</b>
                                    </u>
                                    :
                                  </p>
                                  <TypeIt
                                    options={{
                                      speed: 0.8,
                                      waitUntilVisible: false,
                                      lifelike: true,
                                      cursorChar: " ",
                                    }}
                                  >
                                    <p>{message.content}</p>
                                  </TypeIt>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  {isTyping && <p>Enio is typing...</p>}
                  {!isTyping && (
                    <button
                      onClick={() => {
                        handleCommand();
                        clearInput();
                      }}>
                      Send Command
                    </button>
                  )}
                  <div className='command-section'></div>
                  <div className='input-container'>
                    <textarea
                      type='text'
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={
                        tokensUsed >= maxTokens
                          ? "No Tokens !"
                          : "Enter your command..."
                      }
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      rows='1' // Cette propriété permet à la barre de grandir avec le contenu
                      disabled={tokensUsed >= maxTokens} // Désactive l'input si tous les tokens sont utilisés
                    />
                    <div className='information-section'>
                      {tokensUsed !== null && (
                        <p>
                          Nombre de tokens utilisés dans cette interaction :{" "}
                          {tokensUsed}/{maxTokens}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </ParallaxLayer>
              <ParallaxLayer
                className="section-experience"
                offset={1}
                speed={0.5}
              >
                <div className='Stats'>
                  <h2>Skills</h2>
                  <div className='skill'>
                    <p>Social :</p>
                  </div>
                  <div className='progress-bar'>
                    <div className='progress' style={{ width: "90%" }}>
                      90%
                    </div>
                  </div>

                  <div className='skill'>
                    <p>Anglais :</p>
                  </div>
                  <div className='progress-bar'>
                    <div className='progress' style={{ width: "90%" }}>
                      90%
                    </div>
                  </div>

                  <h4>Informatique</h4>
                  <div className='skill'>
                    <p>HTML :</p>
                  </div>
                  <div className='progress-bar'>
                    <div className='progress' style={{ width: "90%" }}>
                      90%
                    </div>
                  </div>

                  <div className='skill'>
                    <p>CSS :</p>
                  </div>
                  <div className='progress-bar'>
                    <div className='progress' style={{ width: "65%" }}>
                      65%
                    </div>
                  </div>

                  <div className='skill'>
                    <p>JAVASCRIPT :</p>
                  </div>
                  <div className='progress-bar'>
                    <div className='progress' style={{ width: "50%" }}>
                      50%
                    </div>
                  </div>
                </div>
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
              </ParallaxLayer>
              <ParallaxLayer
                className="Parcours"
                offset={2}
                speed={1}
              >
                  <VerticalTimeline lineColor={"#ffffffff"}>
                    <VerticalTimelineElement
                      className='vertical-timeline-element-work'
                      contentStyle={{
                        background: "rgb(27, 128, 119)",
                        color: "#fff",
                      }}
                      contentArrowStyle={{
                        borderRight: "7px solid  rgb(27, 128, 119)",
                      }}
                      date='2021-2022'
                      iconStyle={{ background: "rgb(27, 128, 119)", color: "#fff" }}
                      icon={
                        <img
                          src='/Icon/Windows95/Sort by Category [Without duplicates]/Other IRL/Desktop.ico'
                          style={{ width: "100%", height: "100%" }}
                        />
                      }>
                      <h3 className='vertical-timeline-element-title'>
                        {`
                    Technicien informatique et Responsable Kiosque
                    `}
                      </h3>
                      <h4 className='vertical-timeline-element-subtitle'>
                        {`
                    EDF RTE - Jonage (SPIE)
                    `}
                      </h4>
                      <p>
                        {`
                    Accueil et conseils informatiques/téléphonie aux
                    utilisateurs (questions technique/ logiciels, questions
                    téléphonie). Gestion du parc informatique (mise à jour,
                    installations technique et logiciels, projets, gestion de
                    bases de données, gestion des tickets, travail en équipe)
                    `}
                      </p>
                    </VerticalTimelineElement>
                    <VerticalTimelineElement
                      className='vertical-timeline-element-work'
                      contentStyle={{
                        background: "rgb(27, 128, 119)",
                        color: "#fff",
                      }}
                      contentArrowStyle={{
                        borderRight: "7px solid  rgb(27, 128, 119)",
                      }}
                      date='2021-2022'
                      iconStyle={{ background: "rgb(27, 128, 119)", color: "#fff" }}
                      icon={
                        <img
                          src='/Icon/Windows95/Sort by Category [Without duplicates]/Other IRL/Desktop.ico'
                          style={{ width: "100%", height: "100%" }}
                        />
                      }>
                      <h3 className='vertical-timeline-element-title'>
                        {`
                    Technicien déploiement informatique
                    `}
                      </h3>
                      <h4 className='vertical-timeline-element-subtitle'>
                        {`
                    Centre Hospitalier Universaire - Hôpital Nord
                    `}
                      </h4>
                      <p>
                        {`
                    Masterisation et déploiement de différents ordinateurs.
                    Gestion de résolution de problèmes techniques et logiciels.
                    Gestion de parc et de tickets. Résolution d'urgences ou de
                    travaux dans des situations compliquées/stress à gérer.
                    `}
                      </p>
                    </VerticalTimelineElement>
                    <VerticalTimelineElement
                      className='vertical-timeline-element-work'
                      contentStyle={{
                        background: "rgb(27, 128, 119)",
                        color: "#fff",
                      }}
                      contentArrowStyle={{
                        borderRight: "7px solid  rgb(27, 128, 119)",
                      }}
                      date='2020-2021'
                      iconStyle={{ background: "rgb(27, 128, 119)", color: "#fff" }}
                      icon={
                        <img
                          src='/Icon/Windows95/Sort by Category [Without duplicates]/Other IRL/Desktop.ico'
                          style={{ width: "100%", height: "100%" }}
                        />
                      }>
                      <h3 className='vertical-timeline-element-title'>
                        {`
                    Gestion de site WEB et parc informatique
                    `}
                      </h3>
                      <h4 className='vertical-timeline-element-subtitle'>
                        {`
                    Le PAX
                    `}
                      </h4>
                      <p>
                        {`
                    Remise à neuf du site Internet du PAX, gestion d'un site
                    avec WordPress, mise à jour des différents postes
                    informatiques, optimisation de certaines tâches. Mise en
                    place de concerts.
                    `}
                      </p>
                    </VerticalTimelineElement>
                    <VerticalTimelineElement
                      className='vertical-timeline-element-work'
                      contentStyle={{
                        background: "rgb(27, 128, 119)",
                        color: "#fff",
                      }}
                      contentArrowStyle={{
                        borderRight: "7px solid  rgb(27, 128, 119)",
                      }}
                      date='2019-2020'
                      iconStyle={{ background: "rgb(27, 128, 119)", color: "#fff" }}
                      icon={
                        <img
                          src='/Icon/Windows95/Sort by Category [Without duplicates]/Other IRL/Desktop.ico'
                          style={{ width: "100%", height: "100%" }}
                        />
                      }>
                      <h3 className='vertical-timeline-element-title'>
                        {`
                    Auto-Entrepreneur "Games Escape Game"
                    `}
                      </h3>
                      <h4 className='vertical-timeline-element-subtitle'>
                        {`
                    "Games Escape Game"
                    `}
                      </h4>
                      <p>
                        {`
                  J'ai participé à la création de salle/énigmes et j'ai
                  apporté mes idées au sein de l'entreprise. J'ai également
                  géré l'accueil de la clientèle, les réservations, les
                  conseils, l'accueil, la réception téléphone de la boite, les
                  travaux manuels. J'ai géré en autonomie toute la gestion de
                  la partie Réalité Virtuelle (mise en place des appareils,
                  présentation des jeux/ consignes/sécurité) ainsi que de
                  l'initiation à la réalité virtuel au sein d'entreprises/
                  événements.
                  `}
                      </p>
                    </VerticalTimelineElement>
                    <VerticalTimelineElement
                      className='vertical-timeline-element-music'
                      contentStyle={{
                        background: "rgb(55, 27, 121)",
                        color: "#fff",
                      }}
                      contentArrowStyle={{
                        borderRight: "7px solid  rgb(55, 27, 121)",
                      }}
                      date='2018'
                      iconStyle={{ background: "rgb(55, 27, 121)", color: "#fff" }}
                      icon={
                        <img
                          src='/Icon/Windows95/Sort by Category [Without duplicates]/Discs/Music Disc.ico'
                          style={{ width: "100%", height: "100%" }}
                        />
                      }>
                      <h3 className='vertical-timeline-element-title'>
                        {`
                    Récompense "Nos talents sur scène 2018"
                    `}
                      </h3>
                      <h4 className='vertical-timeline-element-subtitle'>
                        {`
                    Le Fil + Le Pax
                    `}
                      </h4>
                      <p>

                        {`
                    Plusieurs representations scéniques d'une demi heure avec
                    interpretation de mes instrumentales/textes/mise en scène
                    etc...

                    `}
                      </p>
                    </VerticalTimelineElement>
                    <VerticalTimelineElement
                      className='vertical-timeline-element-music'
                      contentStyle={{
                        background: "rgb(55, 27, 121)",
                        color: "#fff",
                      }}
                      contentArrowStyle={{
                        borderRight: "7px solid  rgb(55, 27, 121)",
                      }}
                      date='2018'
                      iconStyle={{ background: "rgb(55, 27, 121)", color: "#fff" }}
                      icon={
                        <img
                          src='/Icon/Windows95/Sort by Category [Without duplicates]/Discs/Music Disc.ico'
                          style={{ width: "100%", height: "100%" }}
                        />
                      }>
                      <h3 className='vertical-timeline-element-title'>
                        {`
                    Récompense musical du prix "Seul en Scène"
                    `}
                      </h3>
                      <h4 className='vertical-timeline-element-subtitle'>
                        {`
                    Le Fil + Le Pax
                    `}
                      </h4>
                      <p>
                        {`
                    Plusieurs representations scéniques d'une demi heure avec
                    interpretation de mes instrumentales/textes/mise en scène
                    etc...
                    `}
                      </p>
                    </VerticalTimelineElement>
                    <VerticalTimelineElement
                      className='vertical-timeline-element-work'
                      contentStyle={{
                        background: "rgb(27, 128, 119)",
                        color: "#fff",
                      }}
                      contentArrowStyle={{
                        borderRight: "7px solid  rgb(27, 128, 119)",
                      }}
                      date='2018'
                      iconStyle={{ background: "rgb(27, 128, 119)", color: "#fff" }}
                      icon={
                        <img
                          src='/Icon/Windows95/Sort by Category [Without duplicates]/Other IRL/Desktop.ico'
                          style={{ width: "100%", height: "100%" }}
                        />
                      }>
                      <h3 className='vertical-timeline-element-title'>
                        {`
                    Plonge
                    `}
                      </h3>
                      <h4 className='vertical-timeline-element-subtitle'>
                        {`
                    Carré des nuances Saint-Etienne
                    `}
                      </h4>
                      <p>
                        {`
                    Travail de deux mois à la plonge du restaurant "Le carré des
                    nuances".
                    `}
                      </p>
                    </VerticalTimelineElement>
                    <VerticalTimelineElement
                      className='vertical-timeline-element-work'
                      contentStyle={{
                        background: "rgb(27, 128, 119)",
                        color: "#fff",
                      }}
                      contentArrowStyle={{
                        borderRight: "7px solid  rgb(27, 128, 119)",
                      }}
                      date='2017'
                      iconStyle={{ background: "rgb(27, 128, 119)", color: "#fff" }}
                      icon={
                        <img
                          src='/Icon/Windows95/Sort by Category [Without duplicates]/Other IRL/Desktop.ico'
                          style={{ width: "100%", height: "100%" }}
                        />
                      }>
                      <h3 className='vertical-timeline-element-title'>
                        {`
                    Employé Polyvalent
                    `}
                      </h3>
                      <h4 className='vertical-timeline-element-subtitle'>
                        {`
                    Big Fernand Versailles
                    `}
                      </h4>
                      <p>
                        {`
                    Employé polyvalent à Big Fernand (Versailles) en tant que
                    cuisinier (Plancha/Frites/ Préparation de cuisine :
                    légumes/viandes/pâtisseries/respect des recettes,
                    préparation matériel/nettoyage/normes d'hygiènes...)
                    `}
                      </p>
                    </VerticalTimelineElement>
                    <VerticalTimelineElement
                      className='vertical-timeline-element-work'
                      contentStyle={{
                        background: "rgb(27, 128, 119)",
                        color: "#fff",
                      }}
                      contentArrowStyle={{
                        borderRight: "7px solid  rgb(27, 128, 119)",
                      }}
                      date='2016-2017'
                      iconStyle={{ background: "rgb(27, 128, 119)", color: "#fff" }}
                      icon={
                        <img
                          src='/Icon/Windows95/Sort by Category [Without duplicates]/Other IRL/Desktop.ico'
                          style={{ width: "100%", height: "100%" }}
                        />
                      }>
                      <h3 className='vertical-timeline-element-title'>
                        {`
                    Mission en Service Civique
                    `}
                      </h3>
                      <h4 className='vertical-timeline-element-subtitle'>
                        {`
                    Centre International de Langue Et Civilisation
                    `}
                      </h4>
                      <p>
                        {`
                    Observation de cours en FLE (Français Langue Étrangère) avec
                    les élèves et proffeseurs. Méthodes éducatives, approche des
                    différentes langues, petit cours présenter par mes soins.
                    `}
                      </p>
                    </VerticalTimelineElement>
                    <VerticalTimelineElement
                      className='vertical-timeline-element-stage'
                      contentStyle={{
                        background: "rgb(23, 118, 196)",
                        color: "#fff",
                      }}
                      contentArrowStyle={{
                        borderRight: "7px solid  rgb(23, 118, 196)",
                      }}
                      date='2016'
                      iconStyle={{ background: "rgb(23, 118, 196)", color: "#fff" }}
                      icon={
                        <img
                          src='/Icon/Windows95/Sort by Category [Without duplicates]/Sheets/Certificate 2.ico'
                          style={{ width: "100%", height: "100%" }}
                        />
                      }>
                      <h3 className='vertical-timeline-element-title'>
                        {`
                    Stage observation de cours en FLE
                    `}
                      </h3>
                      <h4 className='vertical-timeline-element-subtitle'>
                        {`
                    Centre International de Langue Et Civilisation
                    `}
                      </h4>
                      <p>
                        {`
                    Observation de cours en FLE (Français Langue Étrangère) avec
                    les élèves et proffeseurs. Méthodes éducatives, approche des
                    différentes langues, petit cours présenter par mes soins.
                    `}
                      </p>
                    </VerticalTimelineElement>
                    <VerticalTimelineElement
                      className='vertical-timeline-element-stage'
                      contentStyle={{
                        background: "rgb(23, 118, 196)",
                        color: "#fff",
                      }}
                      contentArrowStyle={{
                        borderRight: "7px solid  rgb(23, 118, 196)",
                      }}
                      date='2014'
                      iconStyle={{ background: "rgb(23, 118, 196)", color: "#fff" }}
                      icon={
                        <img
                          src='/Icon/Windows95/Sort by Category [Without duplicates]/Sheets/Certificate 2.ico'
                          style={{ width: "100%", height: "100%" }}
                        />
                      }>
                      <h3 className='vertical-timeline-element-title'>
                        {`
                    Stage services ENS Media et communication
                    `}
                      </h3>
                      <h4 className='vertical-timeline-element-subtitle'>
                        {`
                    Ecole Normal Superieur de Lyon
                    `}
                      </h4>
                      <p>
                        {`
                    Création d'affiche et de flyers sur Photoshop et Designer.
                    Apprentissage HTML et CSS basique.
                    `}
                      </p>
                    </VerticalTimelineElement>
                    <VerticalTimelineElement
                      className='vertical-timeline-element-trip'
                      contentStyle={{
                        background: "rgb(39, 121, 14)",
                        color: "#fff",
                      }}
                      contentArrowStyle={{
                        borderRight: "7px solid  rgb(39, 121, 14)",
                      }}
                      date='2014'
                      iconStyle={{ background: "rgb(39, 121, 14)", color: "#fff" }}
                      icon={
                        <img
                          src='/Icon/Windows95/Sort by Category [Without duplicates]/Other IRL/Painting.ico'
                          style={{ width: "100%", height: "100%" }}
                        />
                      }>
                      <h3 className='vertical-timeline-element-title'>
                        {`
                    Voyage Scolaire à New-York
                    `}
                      </h3>
                      <h4 className='vertical-timeline-element-subtitle'>
                        {`
                    Lycée Valbenoite
                    `}
                      </h4>
                      <p>
                        {`
                    Voyage organisé par le Lycée Valbenoite, visite de tous les
                    quartiers les plus connus (Wall Street, Liberty Island,
                    Broadway...). Ce voyage m'a permis de pratiquer la langue
                    Anglaise (contact avec les New-Yorkais, vie exclusivement en
                    langue anglaise).
                    `}
                      </p>
                    </VerticalTimelineElement>
                    <VerticalTimelineElement
                      className='vertical-timeline-element-school'
                      contentStyle={{
                        background: "rgb(23, 118, 196)",
                        color: "#fff",
                      }}
                      contentArrowStyle={{
                        borderRight: "7px solid  rgb(23, 118, 196)",
                      }}
                      date='2004 - 2008'
                      iconStyle={{ background: "rgb(23, 118, 196)", color: "#fff" }}
                      icon={
                        <img
                          src='/Icon/Windows95/Sort by Category [Without duplicates]/Sheets/Certificate 2.ico'
                          style={{ width: "100%", height: "100%" }}
                        />
                      }>
                      <h3 className='vertical-timeline-element-title'>
                        {`
                    Primaire (CHAM)
                    `}
                      </h3>
                      <h4 className='vertical-timeline-element-subtitle'>
                        {`
                    Ecole Fauriel
                    `}
                      </h4>
                      <p>
                        {`
                    Classes à horaires aménagés pour étudier un instrument (le
                    violon) ainsi que le solfège et le chant en partenariat avec
                    le conservatoire Massenet.
                    `}
                      </p>
                    </VerticalTimelineElement>
                  </VerticalTimeline>
              </ParallaxLayer>
            </Parallax>
          </div>
        </div>

        <div className='status-bar'>
          <p className='status-bar-field'>AboutMe</p>
          <p className='status-bar-field'>Slide 1</p>
          <p className='status-bar-field'>CPU Usage: 14%</p>
        </div>
      </Rnd>
    </>
  );
};

export default Whoami;
