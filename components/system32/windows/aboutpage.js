import React, { useState, useRef } from "react";
import { Rnd } from "react-rnd";
import { useZIndex } from "@/components/Tools/ZIndexContext";

import Tilt from "react-next-tilt";

import "/styles/utils/style.module.sass";
import "98.css";
import "/styles/system32/windows/aboutpage.sass";

const AboutPage = ({ closeWindow }) => {


    // Pour gérer le Z-index
    const { bringToFront, zIndex: globalZIndex } = useZIndex();
    const [zIndex, setZIndex] = useState(globalZIndex);

    const updateZIndex = () => {
        const newZIndex = bringToFront(); // Cette fonction devrait maintenant te retourner et setter le nouveau Z-index global
        setZIndex(newZIndex); // Met à jour le Z-index local avec la nouvelle valeur
    };

    // Fonction pour vérifier la taille de l'écran
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
            // Sur un écran de PC, place la fenêtre de manière aléatoire
            const windowWidth = window.innerWidth * 0.5; // 50% de la largeur de l'écran
            const windowHeight = window.innerHeight * 0.5; // 50% de la hauteur de l'écran
            const x = Math.random() * (window.innerWidth - windowWidth);
            const y = Math.random() * (window.innerHeight - windowHeight);
            return { x, y, width: windowWidth, height: windowHeight };
        }
    };

    return (
        <>
            <Rnd
                style={{
                    fontFamily: "Arial, sans-serif",
                    zIndex: zIndex
                }}
                default={{
                    ...getCenterPosition(),
                    width: 350,
                    height: 220,
                }}
                minWidth={350}
                minHeight={220}
                className='window'
                onClick={updateZIndex}
                disableDragging={isMobileScreen()}
                position={isMobileScreen()}
            >
                <div className='title-bar'>
                    <div className='title-bar-text'>About</div>
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

                <div className='window-body' style={{ color: 'white', backgroundColor: 'black', fontFamily: 'Monospace' }}>
                    <div className='contenu-aboutpage'>
                        <div className="welcome-section">
                            <h1>About Page :</h1>
                            <p>{`Ce que vous êtes sur le point de découvrir est classé sous le code ████████. Le SadFlower HUB est le nexus où les mondes de la technologie, de l'art et de l'occulte se rencontrent. Chaque projet, chaque ligne de code, cache une histoire, un mystère à résoudre. Préparez-vous à plonger dans l'abysse des connaissances interdites.`}</p>
                        </div>

                        <div className="technologies-section">
                            <h2>██████ des Technologies Utilisées</h2>
                            <div className="technologies-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Technologie</th>
                                            <th>Description</th>
                                            <th>Version</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>----</td>
                                        </tr>
                                        <tr>
                                            <td>BackEnd</td>
                                        </tr>
                                        <tr>
                                            <td>----</td>
                                        </tr>
                                        <tr>
                                            <td>Next.js</td>
                                            <td>{`La fondation sur laquelle repose notre portail, permettant une expérience utilisateur ████████ et une optimisation sans pareille.`}</td>
                                            <td>13.4.19</td>
                                        </tr>
                                        <tr>
                                            <td>React</td>
                                            <td>{`Cœur battant de nos interfaces, où magie et logique s'entremêlent pour créer des interactions utilisateur ████████.`}</td>
                                            <td>18.2.0</td>
                                        </tr>
                                        <tr>
                                            <td>Strapi</td>
                                            <td>{`La Bibliothèque contenant toutes les archives, documents et images de la SadFlower CORP.`}</td>
                                            <td>v4.20.0</td>
                                        </tr>
                                        <tr>
                                            <td>axios</td>
                                            <td>{`Conduit pour les requêtes HTTP, permettant de communiquer avec les esprits de l'API dans le grand au-delà numérique.`}</td>
                                            <td>1.6.5</td>
                                        </tr>
                                        <tr>
                                            <td>react-dom</td>
                                            <td>{`Le pont entre le monde de React et le DOM, permettant à nos █████████ d'affecter la réalité de la toile.`}</td>
                                            <td>18.2.0</td>
                                        </tr>
                                        <tr>
                                            <td>next-auth</td>
                                            <td>{`Les rituels d'authentification, gardant les portes fermées aux âmes non désirées.`}</td>
                                            <td>4.24.5</td>
                                        </tr>
                                        <tr>
                                            <td>react-router-dom</td>
                                            <td>{`Les chemins cachés à travers notre domaine, guidant les voyageurs vers des destinations ███████.`}</td>
                                            <td>6.18.0</td>
                                        </tr>
                                        <tr>
                                            <td>eslint</td>
                                            <td>{`Le █████████ des règles, veillant à ce que chaque █████████ soit lancé avec précision et sans erreur.`}</td>
                                            <td>8.48.0</td>
                                        </tr>
                                        <tr>
                                            <td>dotenv</td>
                                            <td>{`Le murmure des secrets, permettant à notre environnement de conserver ses mystères à l'abri des regards indiscrets.`}</td>
                                            <td>16.3.1</td>
                                        </tr>
                                        <tr>
                                            <td>----</td>
                                        </tr>
                                        <tr>
                                            <td>FrontEnd</td>
                                        </tr>
                                        <tr>
                                            <td>----</td>
                                        </tr>
                                        <tr>
                                            <td>SASS</td>
                                            <td>{`Les arcanes de notre esthétique, █████████ des styles aussi complexes que les formules d'un ██████████████.`}</td>
                                            <td>1.66.1</td>
                                        </tr>
                                        <tr>
                                            <td>prettier</td>
                                            <td>{`L'enchanteur de code, transformant chaque ligne en une ████████ harmonieuse et lisible.`}</td>
                                            <td>3.2.4</td>
                                        </tr>
                                        <tr>
                                            <td>98.css</td>
                                            <td>{`Une librairie offerte par une ████ charitable, immitant le style de Windows95`}</td>
                                            <td>0.1.18</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="partners-section">
                            <h2>Partenaires et █████████</h2>
                            <p>{`Nos alliés demeurent dans l'ombre, tissant les fils du destin avec nous. Leur présence, bien qu'occultée, est la clé de notre puissance et de notre étendue.`}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-around', opacity: '0.5' }}>
                                {/* Emplacements pour les logos partenaires avec un effet mystérieux */}
                                <div>Logo 1 ██████</div>
                                <div>Logo 2 ██████</div>
                                <div>Logo 3 ██████</div>
                            </div>
                        </div>

                        <div className="inspirations-section">
                            <h2>Inspirations</h2>
                            <p>{`Nous rendons hommage aux ████████ du █████ ancien, aux ███████ de la technologie et aux artistes ████████. Notre œuvre s'inspire des ███ ███████ recoins de l'histoire et de la culture internet, là où le ████████ et le █████ se côtoient.`}</p>
                        </div>

                        <div className="contact-section">
                            <h2>Contactez les ██████</h2>
                            <p>{`Si votre âme est prête à franchir le seuil, utilisez ce formulaire pour envoyer un message codé aux ████████ de SadFlower HUB. Soyez prudents, chaque mot a son poids, chaque question ses conséquences.`}</p>
                            <div className="contactcard-section">
                                <Tilt className="tilt-card"
                                    options={{
                                        max: 25,
                                        scale: 1.05,
                                        radius: 30
                                    }}>
                                    <div className="card-info">
                                        <h3>Contact Card</h3>
                                        <p>Pour toutes missives et autres contacts :</p>
                                        <a href="mailto:tonemail@lesombres.com">enio.sadflower@gmail.com</a>
                                        <div className="social-links">
                                            <a href="https://twitter.com/enioSadflower" target="_blank" rel="noopener noreferrer">Twitter</a>
                                            <a href="https://www.instagram.com/antoine.sadflower/" target="_blank" rel="noopener noreferrer">Instagram</a>
                                            <a href="https://linktr.ee/eniosadflower?subscribe" target="_blank" rel="noopener noreferrer">Linktree (Music)</a>
                                            <a href="https://github.com/EnioSAF" target="_blank" rel="noopener noreferrer">GitHub</a>
                                            {/* Ajoute ici d'autres liens vers tes réseaux sociaux ou ce que tu veux */}
                                        </div>
                                    </div>
                                </Tilt>
                            </div>
                        </div>
                    </div>

                    <div className='status-bar'>
                        <p className='status-bar-field'>About</p>
                        <p className='status-bar-field'>TheMoreUKnow</p>
                        <p className='status-bar-field'>CPU Usage: 55%</p>
                    </div>
                </div>
            </Rnd>
        </>
    );
};

export default AboutPage;
