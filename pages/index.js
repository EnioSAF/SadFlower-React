import React, { useState, useEffect } from 'react';
import fetchBlogs from '@/src/app/helpers/fetch-blogs';

import Window from '@/components/system32/windows/simplewindow';
import FeaturedWindow from '@/components/system32/windows/featuredwindow';
import ArticleExe from '@/components/system32/windows/articlewindow';
import TwitchWindow from '@/components/system32/windows/twitchwindow';

import Icon from '@/components/system32/applications/icon';
import BootsScreen from '@/components/system32/windows/bootscreen';
import TaskBar from '@/components/system32/desktop/TaskBar';

import "98.css";
import '/styles/styles.sass';

function Index() {
    const [featuredBlogs, setFeaturedBlogs] = useState(null);
    const [blogs, setBlogs] = useState(null);
    const [isArticleExeOpen, setIsArticleExeOpen] = useState(false);
    const [isTwitchWindowOpen, setIsTwitchWindowOpen] = useState(false);  // Nouvelle state pour gérer la fenêtre Twitch
    const [isClient, setIsClient] = useState(false);

    // Fonction pour gérer les élements dynamique côté client
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Fonction pour réinitialisier les cookies (vérifie si le site est déjà visité)
    useEffect(() => {
        const hasVisitedBefore = localStorage.getItem('hasVisited');

        if (!hasVisitedBefore) {
            // Si c'est la première visite, réinitialisez le cookie côté serveur
            fetch('/api/reset-cookie')
                .then((response) => response.json())
                .then((data) => {
                    console.log(data.message);

                    // Force le rechargement de la page
                    window.location.reload();
                });

            // Marquez la visite actuelle comme effectuée
            localStorage.setItem('hasVisited', 'true');
        }
    }, []);


    // Fonction pour fetch les articles de blog
    useEffect(() => {
        const fetchData = async () => {
            const [featuredBlogsData, blogsData] = await Promise.all([
                await fetchBlogs("filters[IsFeatured][$eq]=true"),
                await fetchBlogs("filters[IsFeatured][$eq]=false")
            ]);
            setFeaturedBlogs(featuredBlogsData);
            setBlogs(blogsData);
        }
        fetchData();
    }, []);

    // Fonction pour gérer le clique des icones
    const handleIconClick = (iconName) => {
        if (iconName === "Articles") {
            setIsArticleExeOpen(true);
        } else if (iconName === "TwitchWindow") {
            setIsTwitchWindowOpen(true);
        }
    };

    // Fonction pour gérer la fermeture des articles
    const handleArticleExeClose = () => {
        setIsArticleExeOpen(false);
    };

    return (
        <div>
            <div className="desktop">
                <BootsScreen />
                <Icon
                    title="Articles.exe"
                    iconPath="/Icon/Windows95/Sort by Category [Without duplicates]/Folders/Folder catalog.ico"
                    onClick={() => handleIconClick("Articles")}
                />
                {/* Nouvel icône pour Twitch */}
                <Icon
                    title="Twitch.exe"
                    iconPath="/Icon/Windows95/Sort by Category [Without duplicates]/Folders/Folder catalog.ico"
                    onClick={() => handleIconClick("TwitchWindow")}
                />
                {/* Ajoute d'autres icônes ici si nécessaire */}
            </div>

            {isClient && (
                <>
                    {isArticleExeOpen && <ArticleExe onClose={handleArticleExeClose} />}
                    {isTwitchWindowOpen && <TwitchWindow closeWindow={() => setIsTwitchWindowOpen(false)} />}  {/* Affiche la fenêtre Twitch si ouverte */}
                    {/* A ajouter si tu veux voir les fenêtres indépendantes */}
                </>
            )}

            {isClient && (
                <div className="taskbar">
                    <TaskBar />
                </div>
            )}
        </div>
    );
}

export default Index;
