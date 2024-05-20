import React, { useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import { useZIndex } from "/components/Tools/ZIndexContext";
import { API } from "/components/Tools/SignInOut/constant";

import { PixelArtCard } from "react-pixelart-face-card";
import { Tilt } from 'react-next-tilt';
import { sprites } from "@/components/system32/applications/SadGotchu/Tamagotchi-Core.js";

import "98.css";
import "/styles/system32/windows/window.sass";
import "/styles/system32/windows/SignInSignOut/userlist.sass";

const UserList = ({ closeWindow }) => {
  const [users, setUsers] = useState([]);

  // POur fetch le user et les SadGotchus
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API}/users`);
        if (!response.ok) throw new Error("Network response was not ok");
        const users = await response.json();

        const usersWithSadGotchu = await Promise.all(users.map(async (user) => {
          try {
            const sadGotchuResponse = await fetch(`${API}/sad-gotchus?filters[users_permissions_user][id][$eq]=${user.id}`);
            if (!sadGotchuResponse.ok) throw new Error("Failed to fetch SadGotchu");
            const sadGotchuResult = await sadGotchuResponse.json();

            // Assurons-nous d'accéder correctement aux données
            const sadGotchuData = sadGotchuResult.data && sadGotchuResult.data.length > 0 ? sadGotchuResult.data[0].attributes : null;

            return {
              ...user,
              sadGotchu: sadGotchuData,
              sprite: sadGotchuData ? sprites[sadGotchuData.stage] : 'default-image.png'
            };
          } catch (error) {
            console.error(`Error fetching SadGotchu for user ${user.id}:`, error);
            return { ...user, sadGotchu: null, sprite: 'default-image.png' };
          }
        }));

        setUsers(usersWithSadGotchu);
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs:", error);
      }
    };

    fetchUsers();
  }, []);

  // Pour les détails des SadGotchus
  const [selectedSadGotchu, setSelectedSadGotchu] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const showSadGotchuDetails = (sadGotchu, userId) => {
    setSelectedSadGotchu(sadGotchu);
    setSelectedUserId(userId); // Stocke l'ID de l'utilisateur dont les détails sont affichés
  };

  const closeSadGotchuDetails = () => {
    setSelectedSadGotchu(null);
    setSelectedUserId(null);
  };

  // Pour les animations des SadGotchus

  const getRandomAnimationStyle = () => {
    const duration = Math.random() * 4 + 4; // Durée entre 4 et 8 secondes
    const translateY = Math.random() * 5 + 5; // Translation entre 5px et 10px
    const rotate = Math.random() * 4 - 2; // Rotation entre -2deg et 2deg

    return {
        animationDuration: `${duration}s`,
        animationName: 'floatAndTilt',
        animationTimingFunction: 'ease-in-out',
        animationIterationCount: 'infinite',
        transform: `translateY(-${translateY}px) rotate(${rotate}deg)`
    };
};

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
    <Rnd
      style={{
        zIndex: zIndex
      }}
      default={{
        ...getCenterPosition(),
        width: 400,
        height: 420,
      }}
      minWidth={350}
      minHeight={220}
      className='window'
      onClick={updateZIndex}
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
            <Tilt
              key={user.id}
              borderRadius="20%"
            >
              <div key={user.id} className='user-card'>
                <div className='user-avatar'>
                  {user.avatar && (
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
                  )}
                </div>
                <div className='user-info'>
                  <h3>{user.username}</h3>
                  {/* Autres informations de l'utilisateur si nécessaire */}
                </div>
                {user.sadGotchu && (
                  <div className='user-sadgotchu' onClick={() => showSadGotchuDetails(user.sadGotchu, user.id)}>
                    <div className='capsule-container'>
                      <img src='/SadGotchu/capsule.png' alt='Capsule' className='capsule-image' />
                      <img src={sprites[user.sadGotchu.stage]} alt='SadGotchu' className='sadgotchu-sprite' style={getRandomAnimationStyle()} />
                    </div>
                    <div className='sadgotchu-name'>{user.sadGotchu.name}</div>
                  </div>
                )}
                <div>
                  {user.id === selectedUserId && selectedSadGotchu && (
                    <div className="modal-background" onClick={closeSadGotchuDetails}>
                      <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h2>Détails de SadGotchu</h2>
                        <p>Nom : {selectedSadGotchu.name}</p>
                        <p>Stade : {selectedSadGotchu.stage}</p>
                        <p>Âge : {selectedSadGotchu.age}</p>
                        <p>Faim : {selectedSadGotchu.hunger}</p>
                        <p>Bonheur : {selectedSadGotchu.happiness}</p>
                        <button onClick={closeSadGotchuDetails}>Fermer</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Tilt>
          ))}
        </div>
      </div>
      <div className='status-bar'>
        <p className='status-bar-field'>UserList</p>
        <p className='status-bar-field'>Compilation Ext.</p>
        <p className='status-bar-field'>CPU Usage: 14%</p>
      </div>
    </Rnd>
  );
};

export default UserList;
