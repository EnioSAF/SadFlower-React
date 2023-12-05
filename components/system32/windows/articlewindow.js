import React, { useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import Icon from '../applications/icon';
import FeaturedWindow from './featuredwindow';
import SimpleWindow from './simplewindow';
import fetchBlogs from '@/src/app/helpers/fetch-blogs';
import config from '@/src/config';

import '/styles/system32/applications/windowarticle.sass';
import "98.css";

const ArticleExe = ({ onClose, closeWindow }) => {
    const [position, setPosition] = useState({ x: 50, y: 50 });
    const [size, setSize] = useState({ width: 400, height: 300 });
    const [featuredBlogs, setFeaturedBlogs] = useState(null);
    const [blogs, setBlogs] = useState(null);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [isWindowOpen, setIsWindowOpen] = useState(true);
    const [windowSection, setWindowSection] = useState(null);
    const [isMainArticleExeOpen, setIsMainArticleExeOpen] = useState(true);
    const [upperSectionWindows, setUpperSectionWindows] = useState([]);
    const [lowerSectionWindows, setLowerSectionWindows] = useState([]);

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

    const handleIconClick = (articleTitle, section) => {
        console.log(`Icon clicked: ${articleTitle}`);
        const newWindow = { title: articleTitle, section };

        if (section === "upper") {
            setUpperSectionWindows([...upperSectionWindows, newWindow]);
        } else {
            setLowerSectionWindows([...lowerSectionWindows, newWindow]);
        }
    };

    const handleClose = () => {
        setIsWindowOpen(false);
        onClose();
    };

    const handleCloseMainArticleExe = () => {
        setIsMainArticleExeOpen(false);
        onClose(); // Appelle la fonction onClose uniquement pour la fenêtre principale
    };

    const handleCloseWindow = (window, section) => {
        if (section === "upper") {
            setUpperSectionWindows(upperSectionWindows.filter(w => w !== window));
        } else {
            setLowerSectionWindows(lowerSectionWindows.filter(w => w !== window));
        }
    };

    const strapiBaseUrl = 'http://localhost:1337'; // Rajout de l'url pour les icônes

    return (
        <>
            {isWindowOpen && (
                <Rnd
                    style={{
                        fontFamily: "Arial, sans-serif",
                    }}
                    default={{
                        x: position.x,
                        y: position.y,
                        width: size.width,
                        height: size.height,
                    }}
                    minWidth={350}
                    minHeight={420}
                    className="window"
                >
                    <div className="title-bar">
                        <div className="title-bar-text">Articles.exe</div>
                        <div className="title-bar-controls">
                            <button aria-label="Minimize" />
                            <button aria-label="Maximize" />
                            <button aria-label="Close" onClick={handleCloseMainArticleExe} />
                        </div>
                    </div>

                    <div className="window-body">
                        <div className="upper-section">
                            <h3>La Crème</h3>
                            {featuredBlogs && featuredBlogs.data.map((blog, index) => (
                                <div key={index}>
                                    <Icon
                                        title={blog.attributes.Title}
                                        iconPath={`${strapiBaseUrl}${blog.attributes.Icon.data.attributes.url}`}
                                        onClick={() => handleIconClick(blog.attributes.Title, "upper")}
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="lower-section">
                            <h3>Les Articles</h3>
                            {blogs && blogs.data.map((blog, index) => (
                                <Icon
                                    key={index}
                                    title={blog.attributes.Title}
                                    iconPath={`${strapiBaseUrl}${blog.attributes.Icon.data.attributes.url}`}
                                    onClick={() => handleIconClick(blog.attributes.Title, "lower")}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="status-bar">
                        <p className="status-bar-field">SADFLOWER</p>
                        <p className="status-bar-field">Slide 1</p>
                        <p className="status-bar-field">CPU Usage: 14%</p>
                    </div>
                </Rnd>
            )}

            {upperSectionWindows.map((window, index) => (
                <FeaturedWindow
                    key={index}
                    articleData={featuredBlogs.data.find(blog => blog.attributes.Title === window.title)}
                    closeWindow={() => handleCloseWindow(window, "upper")}
                />
            ))}

            {lowerSectionWindows.map((window, index) => (
                <SimpleWindow
                    key={index}
                    articleData={blogs.data.find(blog => blog.attributes.Title === window.title)}
                    closeWindow={() => handleCloseWindow(window, "lower")}
                />
            ))}
        </>
    );
};

export default ArticleExe;
