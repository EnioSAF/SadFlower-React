import React, { Fragment, useState } from 'react';
import { Rnd } from "react-rnd";
import { API } from '/components/Tools/constant';
import { setToken, setUser } from '/components/Tools/strapitoken';

import "98.css";
import "/styles/system32/windows/window.sass";

const SignUp = ({ closeWindow, switchToSignIn, setLoginStatus, loginStatus }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const onFinish = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const values = Object.fromEntries(formData.entries());

        setIsLoading(true);
        try {
            const response = await fetch(`${API}/auth/local/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            const data = await response.json();
            if (data?.error) {
                throw data?.error;
            } else {
                setToken(data.jwt);
                setUser(data.user);
                setLoginStatus(!loginStatus);
                alert(`Welcome to Social Cards ${data.user.username}!`);
            }
        } catch (error) {
            console.error(error);
            setError(error?.message ?? 'Something went wrong!');
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
            position={isMobileScreen()}
            disableDragging={isMobileScreen()}
        >
            <div className="title-bar">
                <div className="title-bar-text">SignUp.exe</div>
                <div className="title-bar-controls">
                    <button aria-label="Minimize" />
                    <button aria-label="Maximize" />
                    <button aria-label="Close" onClick={closeWindow} onTouch={closeWindow} />
                </div>
            </div>
            <div className="window-body">
                <Fragment>
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <h2>SignUp</h2>
                        {error && (
                            <div style={{ color: 'red' }}>
                                {error}
                                <button onClick={() => setError('')}>X</button>
                            </div>
                        )}
                        <form onSubmit={onFinish}>
                            <div>
                                <label>Username</label>
                                <input name="username" required placeholder="Username" />
                            </div>
                            <div>
                                <label>Email</label>
                                <input name="email" required type="email" placeholder="Email address" />
                            </div>
                            <div>
                                <label>Password</label>
                                <input name="password" required type="password" placeholder="Password" />
                            </div>
                            <div>
                                <button type="submit" disabled={isLoading}>
                                    Submit {isLoading && 'Loading...'}
                                </button>
                            </div>
                        </form>
                        <p>
                            Already have an account? <span onClick={switchToSignIn} style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>Sign In</span>
                        </p>
                    </div>
                </Fragment>
            </div>
            <div className="status-bar">
                <p className="status-bar-field">AboutMe</p>
                <p className="status-bar-field">Slide 1</p>
                <p className="status-bar-field">CPU Usage: 14%</p>
            </div>
        </Rnd >
    );
};

export default SignUp;
