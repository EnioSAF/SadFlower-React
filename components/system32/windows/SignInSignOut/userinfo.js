import React, { useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import { setToken, removeToken, removeUser } from '/components/Tools/SignInOut/strapitoken';
import { useAuthContext } from "@/context/AuthContext";

import { PixelArtCard } from 'react-pixelart-face-card'

import "98.css";
import "/styles/system32/windows/window.sass";
import "/styles/system32/windows/SignInSignOut/userinfo.sass";


const UserInfo = ({ closeWindow, setLoginStatus, loginStatus, onEditProfileClick }) => {
    const { user } = useAuthContext();
    const [username, setUsername] = useState('Chargement...');
    const [avatar, setAvatar] = useState(null);

    useEffect(() => {
        if (user) {
            setUsername(user.username);
            if (user.avatar) {
                setAvatar(user.avatar);
            } else {
                setAvatar(null);
            }
        }
    }, [user]);

    const handleLogout = () => {
        removeToken();
        removeUser();
        setLoginStatus(!loginStatus);

        // Rafraîchir la page après la déconnexion
        window.location.reload();
    };

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
                <div className="title-bar-text">UserInfo.exe</div>
                <div className="title-bar-controls">
                    <button aria-label="Minimize" />
                    <button aria-label="Maximize" />
                    <button aria-label="Close" onClick={closeWindow} onTouch={closeWindow} />
                </div>
            </div>
            <div className="window-body">
                <div className="header_space">
                    <h2>USER</h2>
                        <div className="userInfo">
                            <div className="avatar">
                                {avatar ? (
                                    <PixelArtCard size={100} color={user.avatar.baseColor}>
                                        <PixelArtCard.Hair value={user.avatar.hair} color={user.avatar.hairColor} />
                                        <PixelArtCard.HeadAccessory value={user.avatar.headAccessory} color={user.avatar.headAccessoryColor} />
                                        <PixelArtCard.Eyes value={user.avatar.eyes} />
                                        <PixelArtCard.EyesAccessory value={user.avatar.eyesAccessory} color={user.avatar.eyesAccessoryColor} />
                                        <PixelArtCard.EarAccessory value={user.avatar.earAccessory} color={user.avatar.earAccessoryColor} />
                                        <PixelArtCard.Nose value={user.avatar.nose} />
                                        <PixelArtCard.Beard value={user.avatar.beard} />
                                        <PixelArtCard.Mouth value={user.avatar.mouth} />
                                        <PixelArtCard.MouthAccessory value={user.avatar.mouthAccessory} color={user.avatar.mouthAccessoryColor} />
                                        <PixelArtCard.NeckAccessory value={user.avatar.neckAccessory} color={user.avatar.neckAccessoryColor} />
                                    </PixelArtCard>
                                ) : null}
                            </div>
                            <div className="username">
                                <p>
                                    {username}
                                </p>
                            </div>
                        </div>
                        <div className="buttons">
                        <button
                            className="auth_button_logout"
                            onClick={onEditProfileClick}
                        >
                            Edit Profile
                        </button>
                        <button
                            className="auth_button_logout"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                        </div>
                </div>
            </div>
            <div className="status-bar">
                <p className="status-bar-field">AboutMe</p>
                <p className="status-bar-field">Slide 1</p>
                <p className="status-bar-field">CPU Usage: 14%</p>
            </div>
        </Rnd>
    );
};

export default UserInfo;