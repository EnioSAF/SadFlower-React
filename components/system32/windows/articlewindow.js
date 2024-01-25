import React, { useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import Icon from '../applications/icon';
import FeaturedWindow from './featuredwindow';
import SimpleWindow from './simplewindow';
import fetchBlogs from '@/components/Tools/Blog/fetch-blogs';

import '/styles/system32/windows/articlewindow.sass';
import "98.css";

const ArticleExe = ({ onClose, zIndex }) => {
    const [size, setSize] = useState({ width: 400, height: 300 });
    const [featuredBlogs, setFeaturedBlogs] = useState(null);
    const [blogs, setBlogs] = useState(null);
    const [upperSectionWindows, setUpperSectionWindows] = useState([]);
    const [lowerSectionWindows, setLowerSectionWindows] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const [featuredBlogsData, blogsData] = await Promise.all([
                fetchBlogs("filters[IsFeatured][$eq]=true"),
                fetchBlogs("filters[IsFeatured][$eq]=false")
            ]);
            setFeaturedBlogs(featuredBlogsData);
            setBlogs(blogsData);
        }
        fetchData();
    }, []);

    // Fonction pour vérifier la taille de l'écran
    const isMobileScreen = () => window.innerWidth <= 600;
    const getRandomPosition = () => {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        const x = Math.floor(Math.random() * (windowWidth - 350));
        const y = Math.floor(Math.random() * (windowHeight - 220));
        return { x, y };
    };

    const handleIconClick = (articleTitle, section) => {
        const newWindow = { title: articleTitle, section };
        if (section === "upper") {
            setUpperSectionWindows(prevWindows => [...prevWindows, newWindow]);
        } else {
            setLowerSectionWindows(prevWindows => [...prevWindows, newWindow]);
        }
    };

    // Fonction pour gérer le focus des fenêtres
    const [focusedWindows, setFocusedWindows] = useState([]);
    const [articleExeZIndex, setArticleExeZIndex] = useState(0);


    const handleWindowClick = (window) => {
        if (window === "ArticleExe") {
            // Si on clique sur ArticleExe, on la met en premier plan
            setArticleExeZIndex(prevZIndex => prevZIndex + 1);
        } else {
            // Si on clique sur une autre fenêtre, on met à jour le tableau focusedWindows
            setFocusedWindows(prevWindows => [window, ...prevWindows.filter(w => w !== window)].reverse());
        }
    };

    // Fonction pour fermer les fenêtres
    const handleCloseWindow = (window, section) => {
        if (section === "upper") {
            setUpperSectionWindows(prevWindows => prevWindows.filter(w => w.title !== window.title));
        } else {
            setLowerSectionWindows(prevWindows => prevWindows.filter(w => w.title !== window.title));
        }
    };

    return (
        <>
            <Rnd
                style={{
                    fontFamily: 'Arial, sans-serif',
                    zIndex: zIndex,
                }}
                default={{
                    ...getRandomPosition(),
                    width: 430,
                    height: 700,
                }}
                minWidth={350}
                minHeight={380}
                className="window"
                position={isMobileScreen()}
                disableDragging={isMobileScreen()}
            >
                <div className="title-bar">
                    <div className="title-bar-text">Articles.exe</div>
                    <div className="title-bar-controls">
                        <button aria-label="Minimize" />
                        <button aria-label="Maximize" />
                        <button aria-label="Close" onClick={onClose} onTouch={onClose} />
                    </div>
                </div>

                <div className="window-body">
                    <h3>La Crème</h3>
                    <div className="upper-section">
                        {featuredBlogs && featuredBlogs.data && featuredBlogs.data.map((blog) => (
                            <div key={blog.attributes.Title} className="icon-container">
                                <Icon
                                    title={blog.attributes.Title}
                                    iconPath={`${blog.attributes.Icon.data.attributes.url}`}
                                    onClick={() => handleIconClick(blog.attributes.Title, "upper")}
                                    onTouchStart={() => handleIconClick(blog.attributes.Title, "upper")}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="section-divider"></div>

                    <h3>Les Articles</h3>
                    <div className="lower-section">
                        {blogs && blogs.data && blogs.data.map((blog) => (
                            <div key={blog.attributes.Title} className="icon-container">
                                <Icon
                                    title={blog.attributes.Title}
                                    iconPath={`${blog.attributes.Icon.data.attributes.url}`}
                                    onClick={() => handleIconClick(blog.attributes.Title, "lower")}
                                    onTouchStart={() => handleIconClick(blog.attributes.Title, "lower")}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="status-bar">
                    <p className="status-bar-field">SADFLOWER</p>
                    <p className="status-bar-field">BlogMode : on</p>
                    <p className="status-bar-field">CPU Usage: 66%</p>
                </div>
            </Rnd>

            {upperSectionWindows.map((window, index) => (
                <FeaturedWindow
                    key={index}
                    articleData={featuredBlogs.data.find(blog => blog.attributes.Title === window.title)}
                    closeWindow={() => handleCloseWindow(window, "upper")}
                    onClick={() => handleWindowClick(window)}
                    zIndex={focusedWindows.indexOf(window) + 1} // Donne le bon z-index dynamiquement
                />
            ))}

            {lowerSectionWindows.map((window, index) => (
                <SimpleWindow
                    key={index}
                    articleData={blogs.data.find(blog => blog.attributes.Title === window.title)}
                    closeWindow={() => handleCloseWindow(window, "lower")}
                    onClick={() => handleWindowClick(window)}
                    zIndex={focusedWindows.indexOf(window) + 1} // Donne le bon z-index dynamiquement
                />
            ))}
        </>
    );
};

export default ArticleExe;