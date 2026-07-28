import React, { useState, useEffect, useCallback } from "react";
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
import MyWork from "@/components/system32/windows/MyWork/mywork";
import MentionLegal from "@/components/system32/windows/MentionLegal/mentionlegal";
import { playBookSettle } from "@/components/system32/windows/MentionLegal/bookSounds";
import PrivacyConsent from "@/components/system32/windows/PrivacyConsent/privacyconsent";
import TamagotchiWidget from "@/components/system32/applications/SadGotchu/Tamagotchi-Widget";

import PopUpManager from "@/components/system32/windows/PopUp/PopUpManager";

import Icon from "@/components/system32/applications/icon";
import BootsScreen from "@/components/system32/windows/bootscreen";
import TaskBar from "@/components/system32/desktop/TaskBar";
import BrowserTabEffects from "@/components/Tools/BrowserTabEffects";

import "98.css";

const PRIVACY_STORAGE_KEY = "sadflower-privacy-v1";
const DEFAULT_PRIVACY_CONSENT = { analytics: false, externalMedia: false };

function HomePage() {
  const [user, setUser] = useState(null);
  const [featuredBlogs, setFeaturedBlogs] = useState(null);
  const [blogs, setBlogs] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [loginStatus, setLoginStatus] = useState(false);
  const [bootComplete, setBootComplete] = useState(false);
  const [privacyReady, setPrivacyReady] = useState(false);
  const [privacyConsent, setPrivacyConsent] = useState(null);
  const [isPrivacySettingsOpen, setIsPrivacySettingsOpen] = useState(false);
  const [isPrivacyLegalPreviewOpen, setIsPrivacyLegalPreviewOpen] = useState(false);

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
    try {
      const storedConsent = JSON.parse(localStorage.getItem(PRIVACY_STORAGE_KEY));
      if (storedConsent && typeof storedConsent.analytics === "boolean" && typeof storedConsent.externalMedia === "boolean") {
        setPrivacyConsent(storedConsent);
      }
    } catch {
      localStorage.removeItem(PRIVACY_STORAGE_KEY);
    } finally {
      setPrivacyReady(true);
    }
  }, []);

  const handleBootComplete = useCallback(() => setBootComplete(true), []);

  const savePrivacyConsent = useCallback((nextConsent) => {
    const normalizedConsent = { ...DEFAULT_PRIVACY_CONSENT, ...nextConsent };
    localStorage.setItem(PRIVACY_STORAGE_KEY, JSON.stringify(normalizedConsent));
    setPrivacyConsent(normalizedConsent);
    setIsPrivacySettingsOpen(false);
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
  const [isMyWorkOpen, setIsMyWorkOpen] = useState(false);
  const [isMentionLegalOpen, setIsMentionLegalOpen] = useState(false);

  // Fonction pour le SignIn et SignUp et EditProfile et UserList
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isUserInfoOpen, setIsUserInfoOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [showUserList, setShowUserList] = useState(false);

  const activeWindow = isMyWorkOpen
    ? "mywork"
    : isArticleExeOpen
      ? "articles"
      : isMentionLegalOpen
        ? "mentionLegal"
        : isTwitchWindowOpen
          ? "twitch"
          : isWhoamiOpen
            ? "whoami"
            : isUserInfoOpen || isEditProfileOpen || isSignInOpen || isSignUpOpen
              ? "profile"
              : null;

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
        if (isMobileDevice() && privacyConsent?.externalMedia === true) {
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
      case "MyWork":
        setIsMyWorkOpen(true);
        break;
      case "MentionLegal":
        playBookSettle();
        setIsPrivacyLegalPreviewOpen(false);
        setIsMentionLegalOpen(true);
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
      <BrowserTabEffects isBooting={!bootComplete} activeWindow={activeWindow} />
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
            <BootsScreen onComplete={handleBootComplete} />
            <div className='desktop-icons'>
              <Icon
                title='WhoAmI.exe'
                iconPath='/Icon/Windows95/Sort by Category [Without duplicates]/Help/Help book.ico'
                onClick={() => handleIconClick("Whoami")}
              />
              <Icon
                title='MyWork.exe'
                iconPath='/Icon/Windows95/Sort by Category [Without duplicates]/Programs/Web-document program.ico'
                onClick={() => handleIconClick("MyWork")}
              />
              <Icon
                title='Articles.exe'
                iconPath='/Icon/Windows95/Sort by Category [Without duplicates]/Folders/Folder catalog.ico'
                onClick={() => handleIconClick("Articles")}
              />
              <Icon
                title='MentionLegal.exe'
                iconPath='/Icon/Windows95/Sort by Category [Without duplicates]/Books/Book.ico'
                onClick={() => handleIconClick("MentionLegal")}
              />
              <Icon
                title='Twitch.exe'
                iconPath='/Icon/Windows95/Sort by Category [Without duplicates]/Media/Movie frame (in hands).ico'
                onClick={() => handleIconClick("TwitchWindow")}
              />
            </div>
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
                  externalMediaAllowed={privacyConsent?.externalMedia === true}
                  onAllowExternalMedia={() => savePrivacyConsent({
                    analytics: privacyConsent?.analytics === true,
                    externalMedia: true,
                  })}
                />
              )}
              {isWhoamiOpen && (
                <Whoami
                  closeWindow={() => setWhoamiOpen(false)}
                  username={user?.username}
                />
              )}
              {isMyWorkOpen && (
                <MyWork closeWindow={() => setIsMyWorkOpen(false)} />
              )}
              {isMentionLegalOpen && (
                <MentionLegal closeWindow={() => {
                  setIsMentionLegalOpen(false);
                  setIsPrivacyLegalPreviewOpen(false);
                }} />
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
          {isClient && bootComplete && privacyReady && !isPrivacyLegalPreviewOpen && (!privacyConsent || isPrivacySettingsOpen) && (
            <PrivacyConsent
              initialConsent={privacyConsent}
              onSave={savePrivacyConsent}
              onOpenLegal={() => {
                playBookSettle();
                setIsPrivacyLegalPreviewOpen(true);
                setIsMentionLegalOpen(true);
              }}
            />
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
                onPrivacyClick={() => setIsPrivacySettingsOpen(true)}
              />
            </div>
          )}
        </div>
      </div>
      {privacyConsent?.analytics === true && <Analytics />}
    </div>
  );
}

export default HomePage;
