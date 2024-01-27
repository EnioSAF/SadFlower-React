import React, { useState, useEffect, closeWindow } from 'react';
import { Rnd } from "react-rnd";
import { API } from '/components/Tools/SignInOut/constant';
import { PixelArtCard } from 'react-pixelart-face-card';

import "98.css";
import "/styles/system32/windows/window.sass";
import "/styles/system32/windows/SignInSignOut/userlist.sass";

const UserList = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${API}/users`);
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Erreur lors de la récupération des utilisateurs:', error);
            }
        };

        fetchUsers();
    }, []);

    // Fonction pour vérifier la taille de l'écran
    const isMobileScreen = () => window.innerWidth <= 600;

    // Fonction pour centrer la fenêtre
    const getCenterPosition = () => {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        const x = (windowWidth - 350) / 2; // 350 est la largeur de la fenêtre
        const y = (windowHeight - 220) / 2; // 220 est la hauteur de la fenêtre

        return { x, y };
    };


    return (
        <Rnd
            default={{
                ...getCenterPosition(),
                width: 350,
                height: 220,
            }}
            minWidth={350}
            minHeight={380}
            className="window"
            disableDragging={isMobileScreen()}
            position={isMobileScreen()}
        >
            <div className="title-bar">
                <div className="title-bar-text">UserList.exe</div>
                <div className="title-bar-controls">
                    <button aria-label="Minimize" />
                    <button aria-label="Maximize" />
                    <button aria-label="Close" onClick={closeWindow} onTouch={closeWindow} />
                </div>
            </div>
            <div className="window-body">
                <div className="user-list">
                    {users.map(user => (
                        <div key={user.id} className="user-card">
                            <div className="user-avatar">
                                {user.avatar && (
                                    <PixelArtCard size={100} color={user.avatar.baseColor}>
                                        <PixelArtCard.Hair value={user.avatar.hair} color={user.avatar.hairColor} />
                                        <PixelArtCard.HeadAccessory value={user.avatar.headAccessory} color={user.avatar.headAccessoryColor} />
                                        <PixelArtCard.Eyes value={user.avatar.eyes} color={user.avatar.eyesColor} />
                                        <PixelArtCard.EyesAccessory value={user.avatar.eyesAccessory} color={user.avatar.eyesAccessoryColor} />
                                        <PixelArtCard.EarAccessory value={user.avatar.earAccessory} color={user.avatar.earAccessoryColor} />
                                        <PixelArtCard.Nose value={user.avatar.nose} />
                                        <PixelArtCard.Beard value={user.avatar.beard} />
                                        <PixelArtCard.Mouth value={user.avatar.mouth} color={user.avatar.mouthColor} />
                                        <PixelArtCard.MouthAccessory value={user.avatar.mouthAccessory} color={user.avatar.mouthAccessoryColor} />
                                        <PixelArtCard.NeckAccessory value={user.avatar.neckAccessory} color={user.avatar.neckAccessoryColor} />
                                    </PixelArtCard>
                                )}
                            </div>
                            <div className="user-info">
                                <h3>{user.username}</h3>
                                {/* Autres informations de l'utilisateur si nécessaire */}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="status-bar">
                <p className="status-bar-field">UserList</p>
                <p className="status-bar-field">Slide 1</p>
                <p className="status-bar-field">CPU Usage: 14%</p>
            </div>
        </Rnd >
    );
};

export default UserList;