import React, { useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import { useZIndex } from "@/components/Tools/ZIndexContext";

import GitHubCalendar from "react-github-calendar";
import { PixelArtCard } from "react-pixelart-face-card";
import { Tilt } from 'react-next-tilt';
import { Parallax, ParallaxLayer } from "@react-spring/parallax";
// import { Particles, initParticlesEngine } from "@tsparticles/react";
// import { loadFull } from "tsparticles"; // if you are going to use `loadFull`, install the "tsparticles" package too.
// import { retroGamingParticles, matrixParticles, cardGameParticles } from "../applications/particlesConfig";

import ChatGPTModule from "./ChatGPTModule";
import TimeLineEnio from "./VerticalTimeline";

import "98.css";
import "react-vertical-timeline-component/style.min.css";

const GITHUB_CONTRIBUTIONS_URL = 'https://github-contributions-api.jogruber.de/v4/EnioSAF?y=last';
const GITHUB_ACTIVITY_START_YEAR = 2022;

const getGitStats = (contributions, total) => {
  const activeDays = contributions.filter(({ count }) => count > 0);
  const bestDay = activeDays.reduce(
    (best, activity) => (activity.count > best.count ? activity : best),
    { count: 0, date: '' }
  );
  let currentStreak = 0;
  let bestStreak = 0;

  contributions.forEach(({ count }) => {
    currentStreak = count > 0 ? currentStreak + 1 : 0;
    bestStreak = Math.max(bestStreak, currentStreak);
  });

  return {
    total,
    activeDays: activeDays.length,
    bestDay: bestDay.count,
    bestDayDate: bestDay.date,
    bestStreak,
  };
};

const Whoami = ({ closeWindow, username }) => {
  const [maxTokens, setMaxTokens] = useState(); //Change ici le nombre de token par session
  const [gitStats, setGitStats] = useState(null);
  const [allTimeStats, setAllTimeStats] = useState(null);
  const [isAllTimeVisible, setIsAllTimeVisible] = useState(false);
  // Pour gérer le Z-index
  const { bringToFront, zIndex: globalZIndex } = useZIndex();
  const [zIndex, setZIndex] = useState(globalZIndex);

  const updateZIndex = () => {
      const newZIndex = bringToFront(); // Cette fonction devrait maintenant te retourner et setter le nouveau Z-index global
      setZIndex(newZIndex); // Met à jour le Z-index local avec la nouvelle valeur
  };

  // // - Pour les particules
  // const [init, setInit] = useState(false);
  // useEffect(() => {
  //   initParticlesEngine(async (engine) => {
  //     await loadFull(engine);
  //     setInit(true); // Indique que l'initialisation est terminée et que les particules peuvent être rendues
  //   });
  // }, []);

  // // Pour le loading :

  // if (!init) {
  //   return <div>Loading particles...</div>; // Affiche un loader ou un fallback tant que les particules ne sont pas prêtes
  // }

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

  useEffect(() => {
    const controller = new AbortController();

    fetch(GITHUB_CONTRIBUTIONS_URL, { signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject(response))
      .then(({ contributions, total }) => setGitStats(getGitStats(contributions, total.lastYear)))
      .catch((error) => {
        if (error.name !== 'AbortError') {
          setGitStats(null);
        }
      });

    return () => controller.abort();
  }, []);

  const toggleAllTimeActivity = async () => {
    const nextVisibility = !isAllTimeVisible;
    setIsAllTimeVisible(nextVisibility);

    if (!nextVisibility || allTimeStats) {
      return;
    }

    const years = Array.from(
      { length: new Date().getFullYear() - GITHUB_ACTIVITY_START_YEAR + 1 },
      (_, index) => GITHUB_ACTIVITY_START_YEAR + index
    );
    const results = await Promise.all(
      years.map(async (year) => {
        const response = await fetch(`https://github-contributions-api.jogruber.de/v4/EnioSAF?y=${year}`);
        const { total } = await response.json();
        return { year, count: response.ok ? total[year] ?? 0 : 0 };
      })
    );
    const total = results.reduce((sum, { count }) => sum + count, 0);
    const bestYear = results.reduce((best, item) => item.count > best.count ? item : best, results[0]);

    setAllTimeStats({ total, bestYear, years: results });
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
        onClick={updateZIndex}
        position={isMobileScreen()}
        disableDragging={isMobileScreen()}>
        <div className='title-bar'>
          <div className='title-bar-text'>WhoAmI.exe</div>
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
                className="section-presentation"
                speed={1}
                factor={2}
              >
                {/* <Particles options={retroGamingParticles} /> */}
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
                  <p>{`Mon histoire avec la tech démarre dès l'enfance, bercé par l'univers parental geek qui m'entoure. Ma première console en main, je plonge dans le monde de la programmation avec le BASIQUE sur l'ORIC. Couplée à mes premières expériences dans le monde du Jeu-Vidéo et de la Musique, je comprends très vite que la création artistique est peut-être plus simple sur un ordinateur, plus intuitive. Cette curiosité insatiable me pousse à expérimenter, bidouiller, créer (parfois... Souvent dans le vide) et, avouons-le, sacrifier quelques gadgets électroniques sur l'autel de l'apprentissage ainsi que de l'attention à mon parcours scolaire. Je voulais agir, et vite. Je commenca donc un parcours professionnel enrichissant en tant que Technicien Informatique, mais c'est dans le développement web que je trouve ma véritable vocation, carrefour parfait entre ma soif de technologie et ma créativité artistique.`}</p>
                  <p>{`Mon voyage musical et professionnel, ponctué d'expériences diverses, de l'Escape Game à la technicité au sein de structures reconnues comme un CHU et EDF RTE, m'a enseigné l'importance du travail en équipe et de la cohésion. La musique, quant à elle, a aiguisé ma sensibilité artistique et la rigueur, essentielle dans le monde du développement web où l'esthétique et la fonctionnalité doivent fusionner harmonieusement.`}</p>
                  <p>{`Aujourd'hui, je m'oriente vers le web développement, désireux de lier ma passion pour l'informatique à cette créativité que je puisse dans l'art, la musique et mes univers. Parfaitement bilingue grâce à des expériences à l'international, dont un séjour marquant à New York, je suis prêt à m'engager dans le défi du numérique, armé de ma sociabilité et d'une volonté de contribuer activement à des projets stimulants.`}</p>
                  <p>{`Je suis Enio, et je suis ici pour apporter ma pierre à l'édifice d'internet, en mêlant technique, art, musique et innovation.`}</p>
                  <section className='GitCalendar' aria-labelledby='git-activity-title'>
                    <div className='GitCalendar__header'>
                      <div>
                        <h2 id='git-activity-title'>Git Activity</h2>
                        <p>GitHub contribution report · last 12 months</p>
                      </div>
                      <span className='GitCalendar__live' aria-label='Live GitHub data'>LIVE</span>
                    </div>
                    <div className='GitCalendar__stats' aria-live='polite'>
                      <div><strong>{gitStats?.total ?? '—'}</strong><span>contributions</span></div>
                      <div><strong>{gitStats?.activeDays ?? '—'}</strong><span>active days</span></div>
                      <div><strong>{gitStats?.bestStreak ?? '—'}</strong><span>best streak</span></div>
                      <div><strong>{gitStats?.bestDay ?? '—'}</strong><span>best day</span></div>
                    </div>
                    <div className='GitCalendar__graph' aria-label='Contribution activity for latest six months'>
                      <GitHubCalendar
                        username='EnioSAF'
                        year='last'
                        transformData={(data) => data.slice(-182)}
                        transformTotalCount={false}
                        showWeekdayLabels={false}
                        weekStart={1}
                        blockSize={13}
                        blockMargin={3}
                        fontSize={12}
                        labels={{
                          totalCount: 'Latest six months',
                          legend: {
                            less: 'Less',
                            more: 'More',
                          },
                        }}
                        theme={{
                          light: ['#c8d4ca', '#9cc9a5', '#64a875', '#387b4d', '#14532d'],
                          dark: ['#c8d4ca', '#9cc9a5', '#64a875', '#387b4d', '#14532d'],
                        }}
                      />
                    </div>
                    <a
                      className='GitCalendar__link'
                      href='https://github.com/EnioSAF/'
                      target='_blank'
                      rel='noreferrer'
                    >
                      Open GitHub profile
                    </a>
                    <button
                      className='GitCalendar__allTimeButton'
                      type='button'
                      onClick={toggleAllTimeActivity}
                      aria-expanded={isAllTimeVisible}
                    >
                      {isAllTimeVisible ? 'Hide all-time activity' : 'Show all-time activity'}
                    </button>
                    {isAllTimeVisible && (
                      <div className='GitCalendar__allTime' aria-live='polite'>
                        {allTimeStats ? (
                          <>
                            <p><strong>{allTimeStats.total}</strong> contributions since {GITHUB_ACTIVITY_START_YEAR} · peak: <strong>{allTimeStats.bestYear.count}</strong> in {allTimeStats.bestYear.year}</p>
                            <div className='GitCalendar__yearGrid'>
                              {allTimeStats.years.map(({ year, count }) => (
                                <div key={year}>
                                  <strong>{count}</strong>
                                  <span>{year}</span>
                                </div>
                              ))}
                            </div>
                          </>
                        ) : <p>Loading all-time activity…</p>}
                      </div>
                    )}
                  </section>
                </div>
              </ParallaxLayer>
              <ParallaxLayer
                className="section-chatGPT"
                offset={1}
                speed={1.2}
                factor={1}
              >
                {/* <Particles options={matrixParticles} /> */}
                <ChatGPTModule />
              </ParallaxLayer>

              <ParallaxLayer
                className="section-timeline"
                offset={2}
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
