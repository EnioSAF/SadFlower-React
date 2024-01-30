import React, { useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import { API } from "/components/Tools/SignInOut/constant";

import { PixelArtCard } from "react-pixelart-face-card";
import { Tilt } from 'react-next-tilt';

import "98.css";
import "/styles/system32/windows/window.sass";
import "/styles/system32/windows/SignInSignOut/userlist.sass";

const UserList = ({ closeWindow }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API}/users`);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des utilisateurs:",
          error,
        );
      }
    };

    fetchUsers();
  }, []);

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
    <Rnd
      default={{
        ...getCenterPosition(),
        width: 400,
        height: 420,
      }}
      minWidth={350}
      minHeight={220}
      className='window'
      disableDragging={isMobileScreen()}
      position={isMobileScreen()}
    >
      <div className='title-bar'>
        <div className='title-bar-text'>UserList.exe</div>
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
        <div className='user-list'>
          {users.map((user) => (
            <div key={user.id} className='user-card'>
              <div className='user-avatar'>
                {user.avatar && (
                  <Tilt
                  // fullPageListening
                  >
                  <PixelArtCard
                    size={100}
                    color={user.avatar.baseColor}
                    hoverColor={user.avatar.hoverColor}
                  >
                    <PixelArtCard.Hair
                      value={user.avatar.hair}
                      color={user.avatar.hairColor}
                    />
                    <PixelArtCard.HeadAccessory
                      value={user.avatar.headAccessory}
                      color={user.avatar.headAccessoryColor}
                    />
                    <PixelArtCard.Eyes
                      value={user.avatar.eyes}
                      color={user.avatar.eyesColor}
                    />
                    <PixelArtCard.EyesAccessory
                      value={user.avatar.eyesAccessory}
                      color={user.avatar.eyesAccessoryColor}
                    />
                    <PixelArtCard.EarAccessory
                      value={user.avatar.earAccessory}
                      color={user.avatar.earAccessoryColor}
                    />
                    <PixelArtCard.Nose value={user.avatar.nose} />
                    <PixelArtCard.Beard value={user.avatar.beard} />
                    <PixelArtCard.Mouth
                      value={user.avatar.mouth}
                      color={user.avatar.mouthColor}
                    />
                    <PixelArtCard.MouthAccessory
                      value={user.avatar.mouthAccessory}
                      color={user.avatar.mouthAccessoryColor}
                    />
                    <PixelArtCard.NeckAccessory
                      value={user.avatar.neckAccessory}
                      color={user.avatar.neckAccessoryColor}
                    />
                  </PixelArtCard>
                  </Tilt>
                )}
              </div>
              <div className='user-info'>
                <h3>{user.username}</h3>
                {/* Autres informations de l'utilisateur si nécessaire */}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className='status-bar'>
        <p className='status-bar-field'>UserList</p>
        <p className='status-bar-field'>Slide 1</p>
        <p className='status-bar-field'>CPU Usage: 14%</p>
      </div>
    </Rnd>
  );
};

export default UserList;
