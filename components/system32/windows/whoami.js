import React from "react";
import { Rnd } from "react-rnd";
import styles from '@/styles/utils/style.module.sass';
import { Terminal, useEventQueue, textLine, textWord, commandWord } from 'crt-terminal';
import GitHubCalendar from 'react-github-calendar';

const Whoami = ({ closeWindow, onClick, zIndex }) => {
    const isMobileScreen = () => window.innerWidth <= 600;

    const getRandomPosition = () => {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        const x = Math.floor(Math.random() * (windowWidth - 350));
        const y = Math.floor(Math.random() * (windowHeight - 220));

        return { x, y };
    };

    const eventQueue = useEventQueue();
    const { print } = eventQueue.handlers;

    const handleCommand = (command) => {
        // Logique de question-réponse
        if (command.toLowerCase() === 'bonjour') {
            print([
                textLine({
                    words: [textWord({ characters: 'Salut! Comment ça va ?', className: 'custom-response' })],
                }),
            ]);
        } else if (command.toLowerCase() === 'musique') {
            print([
                textLine({
                    words: [textWord({ characters: 'J\'écoute de la musique en ce moment.', className: 'custom-response' })],
                }),
            ]);
        } else if (command.toLowerCase() === 'help') {
            print([
                textLine({
                    words: [textWord({ characters: 'Je suis EnioSadFlower, j\'éssaye d\'apprendre la programmation et de m\'améliorer dans ce domaine.', className: 'custom-response' })],
                }),
            ]);
        } else {
            print([
                textLine({
                    words: [
                        textWord({ characters: 'Désolé, je ne comprends pas la commande : ' }),
                        commandWord({ characters: command, prompt: '>' }),
                    ],
                }),
            ]);
        }
    };

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

                <GitHubCalendar username="EnioSAF" />


                    {/* Intégration du terminal CRT avec la nouvelle logique de question-réponse */}
                    <Terminal
                        queue={eventQueue}
                        banner={[textLine({ words: [textWord({ characters: 'En attente du message de : USER-5304' })] })]}
                        onCommand={handleCommand}
                    />
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
