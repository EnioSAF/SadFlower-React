import React, { useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import Icon from '../applications/icon';
import FeaturedWindow from './featuredwindow';
import fetchBlogs from '@/src/app/helpers/fetch-blogs';

import '/styles/system32/applications/windowarticle.sass';
import "98.css";

const ArticleExe = () => {
    const [position, setPosition] = useState({ x: 50, y: 50 });
    const [size, setSize] = useState({ width: 400, height: 300 });
    const [featuredBlogs, setFeaturedBlogs] = useState(null);
    const [selectedArticle, setSelectedArticle] = useState(null);  // Ajoute cette ligne

    useEffect(() => {
        const fetchData = async () => {
            const [featuredBlogsData, blogsData] = await Promise.all([
                await fetchBlogs("filters[IsFeatured][$eq]=true"),
                await fetchBlogs("filters[IsFeatured][$eq]=false")
            ]);
            setFeaturedBlogs(featuredBlogsData);
        }
        fetchData();
    }, []);

    const handleIconClick = (articleTitle) => {
        console.log(`Icon clicked: ${articleTitle}`);
        setSelectedArticle(articleTitle);  // Met à jour l'état avec le titre de l'article sélectionné
    };

    return (
        <>
            <Rnd
                style={{
                    fontFamily: "Arial, sans-serif",
                }}
                default={{
                    x: 0,
                    y: 0,
                    width: 350,
                    height: 420,
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
                        <button aria-label="Close" />
                    </div>
                </div>

                {/* ... (le reste du code reste inchangé) */}
                <div className="window-body">
                    <div className="upper-section">
                        {/* Génère les icônes pour chaque Featured Article */}
                        <h3>La Crème</h3>
                        {featuredBlogs && featuredBlogs.data.map((blog, index) => (
                            <Icon
                                key={index}
                                title={blog.attributes.Title}
                                iconPath={blog.attributes.IconPath}
                                onClick={() => handleIconClick(blog.attributes.Title)}
                            />
                        ))}
                    </div>

                    <div className="lower-section">
                        {/* Génère les icônes pour chaque Featured Article */}
                        <h3>Les Articles</h3>
                        {featuredBlogs && featuredBlogs.data.map((blog, index) => (
                            <Icon
                                key={index}
                                title={blog.attributes.Title}
                                iconPath={blog.attributes.IconPath}
                                onClick={() => handleIconClick(blog.attributes.Title)}
                            />
                        ))}
                    </div>
                </div>
                <div className="status-bar">
                    <p className="status-bar-field">PROUT</p>
                    <p className="status-bar-field">Slide 1</p>
                    <p className="status-bar-field">CPU Usage: 14%</p>
                </div>
            </Rnd >

            {/* Affiche la fenêtre correspondante à l'article sélectionné */}
            {selectedArticle && (
                <FeaturedWindow
                    articleData={featuredBlogs.data.find(blog => blog.attributes.Title === selectedArticle)}
                />
            )}
        </>
    );
};

export default ArticleExe;