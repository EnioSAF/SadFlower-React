import React, { useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import Icon from '../applications/icon';
import FeaturedWindow from './featuredwindow';
import SimpleWindow from './simplewindow'; // Importe SimpleWindow ici
import fetchBlogs from '@/src/app/helpers/fetch-blogs';

import '/styles/system32/applications/windowarticle.sass';
import "98.css";

const ArticleExe = ({ onClose }) => {
    const [position, setPosition] = useState({ x: 50, y: 50 });
    const [size, setSize] = useState({ width: 400, height: 300 });
    const [featuredBlogs, setFeaturedBlogs] = useState(null);
    const [blogs, setBlogs] = useState(null);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [isWindowOpen, setIsWindowOpen] = useState(true);
    const [windowSection, setWindowSection] = useState(null); // Ajoute windowSection ici

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
        setSelectedArticle(articleTitle);
        setIsWindowOpen(true);
        setWindowSection(section); // Assure-toi que cette ligne est ajoutée
    };

    const handleClose = () => {
        setIsWindowOpen(false);
        onClose();
    };

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
                            <button aria-label="Close" onClick={handleClose} />
                        </div>
                    </div>

                    <div className="window-body">
                        <div className="upper-section">
                            <h3>La Crème</h3>
                            {featuredBlogs && featuredBlogs.data.map((blog, index) => (
                                <Icon
                                    key={index}
                                    title={blog.attributes.Title}
                                    iconPath={blog.attributes.IconPath}
                                    onClick={() => handleIconClick(blog.attributes.Title, "upper")}
                                />
                            ))}
                        </div>

                        <div className="lower-section">
                            <h3>Les Articles</h3>
                            {blogs && blogs.data.map((blog, index) => (
                                <Icon
                                    key={index}
                                    title={blog.attributes.Title}
                                    iconPath={blog.attributes.IconPath}
                                    onClick={() => handleIconClick(blog.attributes.Title, "lower")}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="status-bar">
                        <p className="status-bar-field">PROUT</p>
                        <p className="status-bar-field">Slide 1</p>
                        <p className="status-bar-field">CPU Usage: 14%</p>
                    </div>
                </Rnd>
            )}

            {selectedArticle && windowSection === "upper" && (
                <FeaturedWindow
                    articleData={featuredBlogs.data.find(blog => blog.attributes.Title === selectedArticle)}
                />
            )}

            {selectedArticle && windowSection === "lower" && (
                <SimpleWindow
                    articleData={blogs.data.find(blog => blog.attributes.Title === selectedArticle)}
                />
            )}
        </>
    );
};

export default ArticleExe;
