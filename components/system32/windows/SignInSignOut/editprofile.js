import React, { useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import { useAuthContext } from "@/context/AuthContext";
import { API, BEARER } from "@/components/Tools/constant";
import { getToken } from "@/components/Tools/strapitoken";

import "98.css";
import "/styles/system32/windows/window.sass";

const EditProfile = ({ closeWindow }) => {
    const { user, setUser } = useAuthContext();
    const [formData, setFormData] = useState({ username: '', email: '' });

    useEffect(() => {
        if (user) {
            setFormData({ username: user.username, email: user.email });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const updateUserData = async (updatedData) => {
        try {
            const response = await fetch(`${API}/user/me`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${BEARER} ${getToken()}`
                },
                body: JSON.stringify(updatedData)
            });
    
            if (response.ok) {
                setUser({ ...user, ...updatedData });
                alert("Profil mis à jour avec succès !");
                // Ici, tu ne tentes pas de parser la réponse en JSON
            } else {
                alert("Erreur lors de la mise à jour du profil.");
            }
        } catch (error) {
            alert("Erreur serveur lors de la mise à jour.");
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        await updateUserData(formData);
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
        >
            <div className="title-bar">
                <div className="title-bar-text">EditProfile.exe</div>
                <div className="title-bar-controls">
                    <button aria-label="Minimize" />
                    <button aria-label="Maximize" />
                    <button aria-label="Close" onClick={closeWindow} onTouch={closeWindow} />
                </div>
            </div>
            <div className="window-body">
                <div className="profile_page">
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Username"
                        />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email"
                        />
                        {/* Ajoute d'autres champs si nécessaire */}
                        <button type="submit">Mettre à jour</button>
                    </form>
                    <div className="status-bar">
                        <p className="status-bar-field">AboutMe</p>
                        <p className="status-bar-field">Slide 1</p>
                        <p className="status-bar-field">CPU Usage: 14%</p>
                    </div>
                </div>
            </div>
        </Rnd>
    );
};

export default EditProfile;
