import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TypeIt from 'typeit-react';

import chatGptConfig from "@/components/system32/applications/chatgptconfig";

import "/styles/system32/windows/WhoAmI/ChatGPTModule.sass";

const ChatGPTModule = ({ username, maxTokens }) => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messageHistory, setMessageHistory] = useState([]);
  const [tokensUsed, setTokensUsed] = useState(null);

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

  return (
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
  );
};

export default ChatGPTModule;