import React, { useState } from "react";
import { Rnd } from "react-rnd";
import { useAuthContext } from "/context/AuthContext";
import { API } from "/components/Tools/SignInOut/constant";
import { setToken, setUser } from "components/Tools/SignInOut/strapitoken";

import "98.css";
import "/styles/system32/windows/window.sass";

const SignIn = ({
  closeWindow,
  switchToSignUp,
  setLoginStatus,
  loginStatus,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  //Pour le login
  const onFinish = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = formData.get("email");
    const password = formData.get("password");

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
        window.location.reload();
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
        width: 350,
        height: 220,
      }}
      minWidth={350}
      minHeight={220}
      className='window'
      disableDragging={isMobileScreen()}
      position={isMobileScreen()}
    >
      <div className='title-bar'>
        <div className='title-bar-text'>SignIn.exe</div>
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
        <div className='signin-container'>
          <div className='signin-form'>
            <h2>SignIn</h2>
            {error && (
              <div className='alert alert-error'>
                {error}
                <button onClick={() => setError("")}>X</button>
              </div>
            )}
            <form onSubmit={onFinish}>
              <div className='form-group'>
                <label>Email</label>
                <input
                  name='email'
                  type='email'
                  required
                  placeholder='Email address'
                />
              </div>
              <div className='form-group'>
                <label>Password</label>
                <input
                  name='password'
                  type='password'
                  required
                  placeholder='Password'
                />
              </div>
              <button type='submit' disabled={isLoading}>
                Login {isLoading && "Loading..."}
              </button>
            </form>
            <p>
              New to Social Cards?{" "}
              <span
                onClick={switchToSignUp}
                style={{
                  cursor: "pointer",
                  color: "blue",
                  textDecoration: "underline",
                }}
              >
                Sign Up
              </span>
            </p>
          </div>
        </div>
        <div className='status-bar'>
          <p className='status-bar-field'>AboutMe</p>
          <p className='status-bar-field'>Slide 1</p>
          <p className='status-bar-field'>CPU Usage: 14%</p>
        </div>
      </div>
    </Rnd>
  );
};

export default SignIn;
