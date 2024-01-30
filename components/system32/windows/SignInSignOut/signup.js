import React, { Fragment, useState } from "react";
import { Rnd } from "react-rnd";
import { API } from "/components/Tools/SignInOut/constant";
import { setToken, setUser } from "/components/Tools/SignInOut/strapitoken";
import generateRandomAvatar from "/components/Tools/SignInOut/AvatarGenerator";

import "98.css";
import "/styles/system32/windows/window.sass";

const SignUp = ({
  closeWindow,
  switchToSignIn,
  setLoginStatus,
  loginStatus,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const onFinish = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const values = Object.fromEntries(formData.entries());
    const avatarInfo = generateRandomAvatar();
    values.avatar = avatarInfo;

    setIsLoading(true);
    try {
      const response = await fetch(`${API}/auth/local/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
        alert(`Bienvenu dans le SadFlower HUB ${data.user.username}!`);
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
        <div className='title-bar-text'>SignUp.exe</div>
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
        <Fragment>
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <h2>SignUp</h2>
            {error && (
              <div style={{ color: "red" }}>
                {error}
                <button onClick={() => setError("")}>X</button>
              </div>
            )}
            <form onSubmit={onFinish}>
              <div>
                <label>Username</label>
                <input name='username' required placeholder='Username' />
              </div>
              <div>
                <label>Email</label>
                <input
                  name='email'
                  required
                  type='email'
                  placeholder='Email address'
                />
              </div>
              <div>
                <label>Password</label>
                <input
                  name='password'
                  required
                  type='password'
                  placeholder='Password'
                />
              </div>
              <div>
                <button type='submit' disabled={isLoading}>
                  Submit {isLoading && "Loading..."}
                </button>
              </div>
            </form>
            <p>
              Already have an account?{" "}
              <span
                onClick={switchToSignIn}
                style={{
                  cursor: "pointer",
                  color: "blue",
                  textDecoration: "underline",
                }}
              >
                Sign In
              </span>
            </p>
          </div>
        </Fragment>
      </div>
      <div className='status-bar'>
        <p className='status-bar-field'>AboutMe</p>
        <p className='status-bar-field'>Slide 1</p>
        <p className='status-bar-field'>CPU Usage: 14%</p>
      </div>
    </Rnd>
  );
};

export default SignUp;
