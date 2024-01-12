import React, { useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';

import axios from 'axios';
import TypeIt from "typeit-react";
import GitHubCalendar from 'react-github-calendar';

import dotenv from 'dotenv';
require('dotenv').config();

import "98.css";
import "/styles/system32/windows/window.sass";
import "/styles/system32/windows/whoami.sass";


const Whoami = ({ closeWindow, onClick, zIndex }) => {

    // Pour la position de la fenêtre

    const isMobileScreen = () => window.innerWidth <= 600;
    const getRandomPosition = () => {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        const x = Math.floor(Math.random() * (windowWidth - 350));
        const y = Math.floor(Math.random() * (windowHeight - 220));
        return { x, y };
    };

    // Pour ChatGPT

    const [output, setOutput] = useState('');
    const [input, setInput] = useState('');
    const [tokensUsed, setTokensUsed] = useState(null);
    const [maxTokens, setMaxTokens] = useState(50);
    const [messageHistory, setMessageHistory] = useState([]);
    const clearInput = () => {
        setInput('');
    };

    const handleCommand = async () => {
        try {
            const apiKey = process.env.OPENAI_KEY;
            const apiUrl = 'https://api.openai.com/v1/chat/completions';

            const messages = [
                { role: 'system', content: 'You are a helpful assistant.' },
                { role: 'user', content: input },
            ];

            const apiResponse = await axios.post(apiUrl, {
                messages,
                max_tokens: maxTokens - tokensUsed,  // Limite le nombre de tokens restants
                model: 'gpt-3.5-turbo',
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
            });

            const gpt3Response = apiResponse.data.choices[0]?.message?.content;
            const usedTokens = apiResponse.data.usage?.total_tokens;

            setOutput(gpt3Response);
            setMessageHistory(prevHistory => [
                ...prevHistory,
                { role: 'user', content: input },
                { role: 'assistant', content: gpt3Response },
            ]);

            // Met à jour le nombre de tokens utilisés dans l'état local
            setTokensUsed(prevTokensUsed => prevTokensUsed + usedTokens);
        } catch (error) {
            console.error('Erreur lors de la requête à l\'API GPT-3 :', error.message);

            // Vérifie si la propriété 'response' est définie avant d'y accéder
            if (error.response) {
                console.error('Réponse détaillée de l\'API:', error.response.data);
            } else {
                console.error('Aucune réponse détaillée de l\'API disponible.');
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

        const wordsCount = output.split(' ').length;
        const displayTimeInSeconds = wordsCount * 0.5;

        await new Promise(resolve => setTimeout(resolve, displayTimeInSeconds * 1000));

        setGifVisible(false);
    };

    useEffect(() => {
        if (output) {
            handleOutputDisplay();
        }
    }, [output]);

    return (
        <>
            <Rnd
                style={{
                    fontFamily: 'Arial, sans-serif',
                    zIndex: zIndex,
                }}
                default={{
                    ...getRandomPosition(),
                    width: 350,
                    height: 220,
                }}
                minWidth={350}
                minHeight={380}
                className={`window ${output ? 'output-visible' : ''} ${input ? 'input-focus' : ''}`}
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
                    <div className="container">
                        <div className="Presentations">
                            <div className="AboutMe">
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam aliquam, mauris eu eleifend laoreet, odio nunc consectetur arcu, a iaculis odio mi ut erat.</p>
                            </div>
                            <div className="GitCalendar">
                                <GitHubCalendar username="EnioSAF" year={2024} />
                            </div>
                        </div>

                        <div className="ChatGPT">
                            <div className="output-section">
                                <div className="image-container">
                                    {(!isInputFocused && !gifVisible) && <img src='/Gif/EnioHeadsleepin.png' alt="EnioHeadsleepin" />}
                                    {gifVisible && <img src='/Gif/EnioHead.gif' alt="EnioHeadGif" />}
                                    {isInputFocused && <img src='/Gif/EnioHeadstill.png' alt="EnioHeadstill" />}
                                </div>
                                <p>Output:</p>
                                {tokensUsed >= maxTokens ? (
                                    <p style={{ color: 'red' }}>ERROR: ALL TOKENS ARE USED</p>
                                ) : (
                                    <div className="message-history">
                                        {messageHistory.map((message, index) => (
                                            <div key={index} className={message.role}>
                                                <p>{message.role === 'user' ? 'You' : 'Enio'}: {message.content}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="command-section">
                                <div className="input-container">
                                    <textarea
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder={tokensUsed >= maxTokens ? "No Tokens !" : "Enter your command..."}
                                        onFocus={handleInputFocus}
                                        onBlur={handleInputBlur}
                                        rows="1" // Cette propriété permet à la barre de grandir avec le contenu
                                        disabled={tokensUsed >= maxTokens} // Désactive l'input si tous les tokens sont utilisés
                                    />
                                </div>
                                <button onClick={() => { handleCommand(); clearInput(); }}>Send Command</button>
                                <div className="information-section">
                                    {tokensUsed !== null && (
                                        <p>Nombre de tokens utilisés dans cette interaction : {tokensUsed}/{maxTokens}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="Skills">
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam aliquam, mauris eu eleifend laoreet, odio nunc consectetur arcu, a iaculis odio mi ut erat.</p>
                    </div>

                    <div className="Parcours">
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam aliquam, mauris eu eleifend laoreet, odio nunc consectetur arcu, a iaculis odio mi ut erat.</p>
                    </div>
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