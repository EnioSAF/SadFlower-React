import React, { useState, useEffect } from 'react';
import fetchBlogs from '@/src/app/helpers/fetch-blogs';
import Image from 'next/image';

import Window from '@/components/system32/windows/simplewindow';
import FeaturedWindow from '@/components/system32/windows/featuredwindow';
import Whoami from '@/components/system32/windows/whoami';
import ArticleExe from '@/components/system32/windows/articlewindow';
import TwitchWindow from '@/components/system32/windows/twitchwindow';

import Icon from '@/components/system32/applications/icon';
import BootsScreen from '@/components/system32/windows/bootscreen';
import TaskBar from '@/components/system32/desktop/TaskBar';

import "98.css";
import '/styles/styles.sass';
import '/styles/system32/desktop/crt.sass';

function Index() {
    const [featuredBlogs, setFeaturedBlogs] = useState(null);
    const [blogs, setBlogs] = useState(null);
    const [isArticleExeOpen, setIsArticleExeOpen] = useState(false);
    const [isTwitchWindowOpen, setIsTwitchWindowOpen] = useState(false);
    const [isWhoamiOpen, setWhoamiOpen] = useState(false);
    const [isClient, setIsClient] = useState(false);

    // Fonction pour gérer les élements dynamique côté client
    useEffect(() => {
        setIsClient(true);
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
        } else if (iconName === "Whoami") {
            setWhoamiOpen(true);
        }
    };

    // Fonction pour gérer la fermeture des articles
    const handleArticleExeClose = () => {
        setIsArticleExeOpen(false);
    };

    console.log("BootsScreen is mounting:", isClient);

    return (
            <div className="scanlines">
                <div className="crt">
                    <div className="desktop">
                    <Image
                className="overlaycrt-image"
                src='/Overlay/overlaycrt.png'
                alt="Overlay Image"
                width={1920}
                height={1080}
            />
                        <BootsScreen />
                        <Icon
                            title="WhoAmI.exe"
                            iconPath="/Icon/Windows95/Sort by Category [Without duplicates]/Folders/Folder catalog.ico"
                            onClick={() => handleIconClick("Whoami")}
                        />
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
                            {isTwitchWindowOpen && <TwitchWindow closeWindow={() => setIsTwitchWindowOpen(false)} />}
                            {isWhoamiOpen && <Whoami closeWindow={() => setWhoamiOpen(false)} />}
                        </>
                    )}

                    {isClient && (
                        <div className="taskbar">
                            <TaskBar />
                        </div>
                    )}
                </div>
            </div>
    );
}

export default Index;
