import React, { useState, useEffect } from "react";
import { getToken, getUser } from "@/components/Tools/SignInOut/strapitoken";
import fetchBlogs from "@/components/Tools/Blog/fetch-blogs";
import Image from "next/image";
import { Analytics } from "@vercel/analytics/react";

import SignIn from "@/components/system32/windows/SignInSignOut/signin";
import SignUp from "@/components/system32/windows/SignInSignOut/signup";
import EditProfile from "@/components/system32/windows/SignInSignOut/editprofile";
import UserInfo from "@/components/system32/windows/SignInSignOut/userinfo";
import UserList from "@/components/system32/windows/SignInSignOut/userlist";
import AboutPage from "@/components/system32/windows/aboutpage";
import Whoami from "@/components/system32/windows/WhoAmI/whoami";
import ArticleExe from "@/components/system32/windows/Articles/articlewindow";
import TwitchWindow from "@/components/system32/windows/twitchwindow";
import TamagotchiWidget from "@/components/system32/applications/SadGotchu/Tamagotchi-Widget";

import PopUpManager from "@/components/system32/windows/PopUp/PopUpManager";

import Icon from "@/components/system32/applications/icon";
import BootsScreen from "@/components/system32/windows/bootscreen";
import TaskBar from "@/components/system32/desktop/TaskBar";

import "98.css";
import "/styles/styles.sass";
import "/styles/system32/windows/index.sass"
import "/styles/system32/desktop/crt.sass";

function HomePage() {
  const [user, setUser] = useState(null);
  const [featuredBlogs, setFeaturedBlogs] = useState(null);
  const [blogs, setBlogs] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [loginStatus, setLoginStatus] = useState(false);

  // Fonction pour vérifier si nous sommes sur PC ou Tablette/téléphone :
  const isMobileDevice = () => {
    return (
      typeof window.orientation !== "undefined" ||
      navigator.userAgent.indexOf("IEMobile") !== -1
    );
  };

  // Fonction pour gérer les élements dynamique côté client
  useEffect(() => {
    setIsClient(true);
  }, []);
  useEffect(() => {
    // Pour gérer si le user est connecté
    var myUser = getUser();
    setUser(myUser);
  }, [loginStatus]);

  // Fonction pour fetch les articles de blog
  useEffect(() => {
    const fetchData = async () => {
      const [featuredBlogsData, blogsData] = await Promise.all([
        await fetchBlogs("filters[IsFeatured][$eq]=true"),
        await fetchBlogs("filters[IsFeatured][$eq]=false"),
      ]);
      setFeaturedBlogs(featuredBlogsData);
      setBlogs(blogsData);
    };
    fetchData();
  }, []);

  // Fontcion pour update les données user
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  // Fonctions des fenetres
  const [isAboutPageOpen, setIsAboutPageOpen] = useState(false);
  const [isArticleExeOpen, setIsArticleExeOpen] = useState(false);
  const [isTwitchWindowOpen, setIsTwitchWindowOpen] = useState(false);
  const [isWhoamiOpen, setWhoamiOpen] = useState(false);

  // Fonction pour le SignIn et SignUp et EditProfile et UserList
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isUserInfoOpen, setIsUserInfoOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [showUserList, setShowUserList] = useState(false);

  // Fonction pour gérer le Tamagotchi
  const [isTamagotchiWidgetOpen, setIsTamagotchiWidgetOpen] = useState(false);
  const openTamagotchiWidget = () => {
    setIsTamagotchiWidgetOpen(true);
  };
  const closeTamagotchiWidget = () => {
    setIsTamagotchiWidgetOpen(false);
  };

  // Fonction pour gérer les autres fenêtres
  const openSignIn = () => {
    setIsSignInOpen(true);
    setIsSignUpOpen(false);
  };
  const openSignUp = () => {
    setIsSignInOpen(false);
    setIsSignUpOpen(true);
  };
  const openEditProfile = () => {
    setIsEditProfileOpen(true);
  };
  const handleUserListClick = () => {
    setShowUserList(true);
  };
  const closeAllModals = () => {
    setIsSignInOpen(false);
    setIsSignUpOpen(false);
  };

  // Fonction pour gérer le clique des icones
  const handleIconClick = (iconName) => {
    switch (iconName) {
      case "Articles":
        setIsArticleExeOpen(true);
        break;
      case "TwitchWindow":
        if (isMobileDevice()) {
          window.location.href = `twitch://stream/eniosadflower`; // Ça ouvre l'app Twitch direct
        } else {
          setIsTwitchWindowOpen(true); // Sinon, ça ouvre la fenêtre normalement
        }
        break;
      case "About":
        setIsAboutPageOpen(true);
        break;
      case "Whoami":
        setWhoamiOpen(true);
        break;
      case "SignIn":
        user ? setIsUserInfoOpen(true) : setIsSignInOpen(true);
        break;
      // ajoute d'autres cas au besoin
    }
  };

  // Fonction pour gérer la fermeture des articles
  const handleArticleExeClose = () => {
    setIsArticleExeOpen(false);
  };

  return (
    <div className='pinchbulgewrapper'>
      <div className='scanlines'>
        <div className='crt'>
          <div className='desktop'>
            <Image
              className='overlaycrt-image'
              src='/Overlay/overlaycrt.png'
              alt='Overlay Image'
              width={1920}
              height={1080}
            />
            <BootsScreen />
            <Icon
              title='WhoAmI.exe'
              iconPath='/Icon/Windows95/Sort by Category [Without duplicates]/Help/Help book.ico'
              onClick={() => handleIconClick("Whoami")}
            />
            <Icon
              title='Articles.exe'
              iconPath='/Icon/Windows95/Sort by Category [Without duplicates]/Folders/Folder catalog.ico'
              onClick={() => handleIconClick("Articles")}
            />
            <Icon
              title='Twitch.exe'
              iconPath='/Icon/Windows95/Sort by Category [Without duplicates]/Media/Movie frame (in hands).ico'
              onClick={() => handleIconClick("TwitchWindow")}
            />
            <>
              <PopUpManager />
            </>
          </div>

          {isClient && (
            <>
              {isAboutPageOpen && (
                <AboutPage
                  closeWindow={() => setIsAboutPageOpen(false)}
                />
              )}
              {isArticleExeOpen && (
                <ArticleExe onClose={handleArticleExeClose} />
              )}
              {isTwitchWindowOpen && (
                <TwitchWindow
                  closeWindow={() => setIsTwitchWindowOpen(false)}
                />
              )}
              {isWhoamiOpen && (
                <Whoami
                  closeWindow={() => setWhoamiOpen(false)}
                  username={user?.username}
                />
              )}
              {!user && isSignInOpen && !isSignUpOpen && (
                <SignIn
                  switchToSignUp={openSignUp}
                  setLoginStatus={setLoginStatus}
                  loginStatus={loginStatus}
                  closeWindow={closeAllModals}
                />
              )}
              {!user && isSignUpOpen && !isSignInOpen && (
                <SignUp
                  switchToSignIn={openSignIn}
                  setLoginStatus={setLoginStatus}
                  loginStatus={loginStatus}
                  closeWindow={closeAllModals}
                />
              )}
              {user && isUserInfoOpen && (
                <UserInfo
                  user={user}
                  setLoginStatus={setLoginStatus}
                  loginStatus={loginStatus}
                  closeWindow={() => setIsUserInfoOpen(false)}
                  onEditProfileClick={openEditProfile}
                  setIsUserInfoOpen={setIsUserInfoOpen}
                  openTamagotchiWidget={openTamagotchiWidget}
                />
              )}
              {isEditProfileOpen && (
                <EditProfile
                  updateUser={updateUser}
                  closeWindow={() => setIsEditProfileOpen(false)}
                />
              )}
              {isTamagotchiWidgetOpen && (
                <TamagotchiWidget closeWindow={closeTamagotchiWidget} />
              )}
              {showUserList && (
                <UserList closeWindow={() => setShowUserList(false)} />
              )}
            </>
          )}
          <div className="watermark-desktop">
            <p>2024 © SadFlower™ OS </p>
          </div>
          {isClient && (
            <div className='taskbar'>
              <TaskBar
                user={user}
                onAboutClick={() => setIsAboutPageOpen(true)}
                onSignInClick={() => setIsSignInOpen(true)}
                onSignUpClick={() => setIsSignUpOpen(true)}
                onUserInfoClick={() => setIsUserInfoOpen(true)}
                onUserListClick={handleUserListClick}
              />
            </div>
          )}
        </div>
      </div>
      <Analytics />
    </div>
  );
}

export default HomePage;
