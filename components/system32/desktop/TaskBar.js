import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

const TaskBar = ({
  user,
  onAboutClick,
  onSignInClick,
  onSignUpClick,
  onUserInfoClick,
  onUserListClick,
  onPrivacyClick,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showStartMenu, setShowStartMenu] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const startMenuRef = useRef(null); // Pour fermer le menu quand clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (startMenuRef.current && !startMenuRef.current.contains(event.target)) {
        setShowStartMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const toggleStartMenu = () => setShowStartMenu(!showStartMenu);

  return (
    <div className='footer'>
      <button className='start-button' onClick={toggleStartMenu}>
        <Image
          className='logo'
          src='/Icon/flower-start.ico'
          alt=''
          width={18}
          height={18}
          aria-hidden='true'
        />
        <span className='start-text'>Start</span>
      </button>
      {showStartMenu && (
        <div className="start-menu" ref={startMenuRef}>
          <div className="start-menu-logocontainer">
            <Image
              className='taskbar-logo'
              src='/Logo/ROTATE NOIR.gif'
              alt='Taskbar Logo'
              width={50}
              height={50}
            />
            <p>SadFlower™ OS</p>
          </div>
          <div className='about'>
            <button className='taskbar-button' onClick={onAboutClick}>
              <Image
                src='/Icon/Windows95/Sort by Category [Without duplicates]/Dialog icons/Question.ico'
                alt='About'
                width={32}
                height={32}
                className='auth-icon'
              />
              About
            </button>
          </div>
          <div className='about'>
            <button className='taskbar-button' onClick={onPrivacyClick}>
              <Image
                src='/Icon/Windows95/Sort by Category [Without duplicates]/Locks & Keys/Document Locked.ico'
                alt='Privacy'
                width={32}
                height={32}
                className='auth-icon'
              />
              Privacy
            </button>
          </div>
          {!user ? (
            <>
              <div className='auth-buttons'>
                <button className='taskbar-button' onClick={onSignInClick}>
                  <Image
                    src='/Icon/Windows95/Sort by Category [Without duplicates]/People/User program.ico'
                    alt='SignIn'
                    width={32}
                    height={32}
                    className='auth-icon'
                  />
                  SignIn
                </button>
              </div>
            </>
          ) : (
            <>
              <div className='user-info'>
                <button className='taskbar-button' onClick={onUserInfoClick}>
                  <Image
                    src='/Icon/Windows95/Sort by Category [Without duplicates]/People/Agent.ico'
                    alt='UserInfo'
                    width={32}
                    height={32}
                    className='auth-icon'
                  />
                  UserInfo
                </button>
              </div>
              <div className='user-list'>
                <button className='taskbar-button' onClick={onUserListClick}>
                  <Image
                    src='/Icon/Windows95/Sort by Category [Without duplicates]/People/People.ico' // Chemin de l'icône de la liste des utilisateurs
                    alt='UserList'
                    width={32}
                    height={32}
                    className='auth-icon'
                  />
                  UserList
                </button>
              </div>
            </>
          )}
        </div>
      )}
      <div className='separator'>|</div>
      <div className='spacer'></div>
      <div className='separator'>|</div>
      <div className='taskbar'>
        {/* Met ici tes icônes de tâches, genre des liens vers tes projets et tout ça */}
      </div>
      <div className='time-zone'>
        {currentTime.toLocaleDateString()} <span className='separator'>|</span>{" "}
        {currentTime.toLocaleTimeString()}
      </div>
    </div>
  );
};

export default TaskBar;
