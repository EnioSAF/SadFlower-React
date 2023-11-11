// Dans About.js
import React, { useState, useEffect } from 'react';
import TaskBar from '@/components/system32/desktop/TaskBar';
import fetchBlogs from '@/src/app/helpers/fetch-blogs';
import Window from '@/components/system32/windows/simplewindow';
import FeaturedWindow from '@/components/system32/windows/featuredwindow';
import ArticleExe from '@/components/system32/windows/articlewindow';
import Icon from '@/components/system32/applications/icon';

import "98.css";
import '/styles/styles.sass';

function About() {
    const [featuredBlogs, setFeaturedBlogs] = useState(null);
    const [blogs, setBlogs] = useState(null);
    const [isArticleExeOpen, setIsArticleExeOpen] = useState(false);

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

    const handleIconClick = (iconName) => {
        // Ouvre la fenêtre Articles.exe ici
        if (iconName === "Articles") {
            setIsArticleExeOpen(true);
        }
    };

    const handleArticleExeClose = () => {
        // La fenêtre Articles.exe a été fermée
        setIsArticleExeOpen(false);
    };

    return (
        <div>
            <div className="desktop">
                <Icon
                    title="Articles.exe"
                    iconPath="/Icon/Windows95/Sort by Category [Without duplicates]/Folders/Folder catalog.ico"
                    onClick={() => handleIconClick("Articles")}
                />
                {/* Ajoute d'autres icônes ici si nécessaire */}
            </div>
            {isArticleExeOpen && <ArticleExe onClose={handleArticleExeClose} />}
            
            
            {/* A ajouter si tu veux voir les fenêtres indépendantes
            <div>
                {featuredBlogs && featuredBlogs.data.map((blog, index) => (
                    <FeaturedWindow key={index} articleData={blog} />
                ))}
            </div>
            <div>
                {blogs && blogs.data.map((blog, index) => (
                    <Window key={index} articleData={blog} />
                ))}
            </div> */}


            <div>
                <TaskBar />
            </div>
        </div>
    );
}

export default About;
