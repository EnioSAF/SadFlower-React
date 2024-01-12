import React, { useState } from "react";
import { Rnd } from "react-rnd";
import { useAuthContext } from '/context/AuthContext';
import { API } from '/components/Tools/constant';
import { setToken, setUser } from '/components/Tools/strapitoken';

import "98.css";
import "/styles/system32/windows/window.sass";

const SignIn = ({ closeWindow, switchToSignUp, setLoginStatus, loginStatus }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    //Pour le login
    const onFinish = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const email = formData.get('email');
        const password = formData.get('password');
        

        setIsLoading(true);
        try {
            const value = { identifier: email, password: password };
            const response = await fetch(`${API}/auth/local?populate=deep`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(value),
            });

            const data = await response.json();
            if (data?.error) {
                throw data?.error;
            } else {
                setToken(data.jwt); // Stocke le JWT dans localStorage ou un endroit similaire
                setUser(data.user); // Met à jour l'état de l'utilisateur dans le contexte
                setLoginStatus(!loginStatus);
                alert(`Welcome back ${data.user.username}!`);
            }
        } catch (error) {
            console.error(error);
            setError(error?.message ?? "Something went wrong!");
        } finally {
            setIsLoading(false);
        }
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
                <div className="title-bar-text">Twitch.tv</div>
                <div className="title-bar-controls">
                    <button aria-label="Minimize" />
                    <button aria-label="Maximize" />
                    <button aria-label="Close" onClick={closeWindow} onTouch={closeWindow} />
                </div>
            </div>
            <div className="window-body">
                <div className="signin-container">
                    <div className="signin-form">
                        <h2>SignIn</h2>
                        {error && (
                            <div className="alert alert-error">
                                {error}
                                <button onClick={() => setError("")}>X</button>
                            </div>
                        )}
                        <form onSubmit={onFinish}>
                            <div className="form-group">
                                <label>Email</label>
                                <input name="email" type="email" required placeholder="Email address" />
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input name="password" type="password" required placeholder="Password" />
                            </div>
                            <button type="submit" disabled={isLoading}>
                                Login {isLoading && "Loading..."}
                            </button>
                        </form>
                        <p>
                            New to Social Cards? <span onClick={switchToSignUp} style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>Sign Up</span>
                        </p>
                    </div>
                </div>
                <div className="status-bar">
                    <p className="status-bar-field">AboutMe</p>
                    <p className="status-bar-field">Slide 1</p>
                    <p className="status-bar-field">CPU Usage: 14%</p>
                </div>
            </div>
        </Rnd>
    );
};

export default SignIn;