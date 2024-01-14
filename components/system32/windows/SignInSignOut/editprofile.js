import React, { useState } from "react";
import { Rnd } from "react-rnd";
import { useAuthContext } from '/context/AuthContext';
import { API } from '/components/Tools/constant';
import { getToken } from '/components/Tools/strapitoken';

import "98.css";
import "/styles/system32/windows/window.sass";

const EditProfile = ({ closeWindow }) => {
    const [loading, setLoading] = useState(false);
    const { user, isLoading, setUser } = useAuthContext();

    const handleProfileUpdate = async (data) => {
        setLoading(true);
        try {
            const response = await fetch(`${API}/users/${user.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    // set the auth token to the user's jwt
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify(data),
            });
            const responseData = await response.json();

            setUser(responseData);
            alert("Data saved successfully!");
        } catch (error) {
            console.error(Error);
            alert("Error While Updating the Profile!");
        } finally {
            setLoading(false);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }


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
                    <form
                        className="profile_form"
                        initialValues={{
                            username: user?.username,
                            email: user?.email,
                            twitter_username: user?.twitter_username,
                            linkedin_username: user?.linkedin_username,
                            github_username: user?.github_username,
                            avatar_url: user?.avatar_url,
                            website_url: user?.website_url,
                            about: user?.about,
                        }}
                        onSubmit={handleProfileUpdate}
                    >
                        <div className="form_group">
                            <label className="form_label">Username</label>
                            <input
                                className="form_input"
                                type="text"
                                name="username"
                                required
                                placeholder="Username"
                            />
                        </div>
                        <div className="form_group">
                            <label className="form_label">Email</label>
                            <input
                                className="form_input"
                                type="email"
                                name="email"
                                required
                                placeholder="Email"
                            />
                        </div>
                        <div className="form_group">
                            <label className="form_label">Avatar Url</label>
                            <input
                                className="form_input"
                                type="url"
                                name="avatar_url"
                                placeholder="Avatar Url"
                            />
                        </div>
                        <div className="form_group">
                            <label className="form_label">About</label>
                            <textarea
                                className="form_textarea"
                                name="about"
                                required
                                maxLength="120"
                                placeholder="About"
                                rows="6"
                            />
                        </div>
                        <div className="form_group">
                            <label className="form_label">Twitter Username</label>
                            <input
                                className="form_input"
                                type="text"
                                name="twitter_username"
                                placeholder="Twitter Username"
                            />
                        </div>
                        <div className="form_group">
                            <label className="form_label">LinkedIn Username</label>
                            <input
                                className="form_input"
                                type="text"
                                name="linkedin_username"
                                placeholder="LinkedIn Username"
                            />
                        </div>
                        <div className="form_group">
                            <label className="form_label">Github Username</label>
                            <input
                                className="form_input"
                                type="text"
                                name="github_username"
                                placeholder="Github Username"
                            />
                        </div>
                        <div className="form_group">
                            <label className="form_label">Website Url</label>
                            <input
                                className="form_input"
                                type="url"
                                name="website_url"
                                placeholder="Website Url"
                            />
                        </div>
                        <button
                            className="profile_save_btn"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="small_spinner" /> Saving
                                </>
                            ) : (
                                "Save"
                            )}
                        </button>
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
