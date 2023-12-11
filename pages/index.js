import React, { useState, useEffect } from 'react';
import TaskBar from '@/components/system32/desktop/TaskBar';
import fetchBlogs from '@/src/app/helpers/fetch-blogs';
import Window from '@/components/system32/windows/simplewindow';
import FeaturedWindow from '@/components/system32/windows/featuredwindow';
import ArticleExe from '@/components/system32/windows/articlewindow';
import TwitchWindow from '@/components/system32/windows/twitchwindow';  // Importe le composant TwitchWindow
import Icon from '@/components/system32/applications/icon';
import BootsScreen from '@/components/system32/windows/bootscreen';

import "98.css";
import '/styles/styles.sass';

function Index() {
    const [featuredBlogs, setFeaturedBlogs] = useState(null);
    const [blogs, setBlogs] = useState(null);
    const [isArticleExeOpen, setIsArticleExeOpen] = useState(false);
    const [isTwitchWindowOpen, setIsTwitchWindowOpen] = useState(false);  // Nouvelle state pour gérer la fenêtre Twitch
    const [isClient, setIsClient] = useState(false);

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

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleIconClick = (iconName) => {
        if (iconName === "Articles") {
            setIsArticleExeOpen(true);
        } else if (iconName === "TwitchWindow") {
            setIsTwitchWindowOpen(true);
        }
    };

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
                <div>
                    <TaskBar />
                </div>
            )}
        </div>
    );
}

export default Index;
