import React, { useState } from "react";
import { Rnd } from "react-rnd";
import { setToken, removeToken, removeUser } from '/components/Tools/strapitoken';
import { useAuthContext } from "@/context/AuthContext";

import EditProfile from "./editprofile";

import "98.css";
import "/styles/system32/windows/window.sass";


const UserInfo = ({ closeWindow, setLoginStatus, loginStatus, onEditProfileClick }) => {
    const { user } = useAuthContext();

    //Fonction pour se déconnecter
    const handleLogout = () => {
        removeToken();
        removeUser();
        setLoginStatus(!loginStatus);
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
                    <div className="auth_buttons">
                        <p>
                            {user ? user.username : 'Chargement...'}
                        </p>
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
