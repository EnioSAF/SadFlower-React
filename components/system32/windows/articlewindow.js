import React, { useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import Icon from '../applications/icon';
import FeaturedWindow from './featuredwindow';
import SimpleWindow from './simplewindow';
import fetchBlogs from '@/src/app/helpers/fetch-blogs';

import '/styles/system32/windows/articlewindow.sass';
import "98.css";

const ArticleExe = ({ onClose }) => {
    const [position, setPosition] = useState({ x: 50, y: 50 });
    const [size, setSize] = useState({ width: 400, height: 300 });
    const [featuredBlogs, setFeaturedBlogs] = useState(null);
    const [blogs, setBlogs] = useState(null);
    const [upperSectionWindows, setUpperSectionWindows] = useState([]);
    const [lowerSectionWindows, setLowerSectionWindows] = useState([]);
    const [zIndexCounter, setZIndexCounter] = useState(1);
    const [activeWindow, setActiveWindow] = useState("main");

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

    const bringToFront = () => {
        setZIndexCounter(prevCounter => prevCounter + 1);
    };

    const handleIconClick = (articleTitle, section) => {
        console.log(`Icon clicked: ${articleTitle}`);
        const newWindow = { title: articleTitle, section };

        if (section === "upper") {
            setUpperSectionWindows(prevWindows => [...prevWindows, newWindow]);
        } else {
            setLowerSectionWindows(prevWindows => [...prevWindows, newWindow]);
        }
    };

    const handleCloseWindow = (window, section) => {
        if (section === "upper") {
            setUpperSectionWindows(prevWindows => prevWindows.filter(w => w.title !== window.title));
        } else {
            setLowerSectionWindows(prevWindows => prevWindows.filter(w => w.title !== window.title));
        }
    };

    const strapiBaseUrl = 'https://sadflower-server-3c85453c8087.herokuapp.com';

    return (
        <>
            <Rnd
                style={{
                    fontFamily: "Arial, sans-serif",
                    zIndex: activeWindow === "main" ? zIndexCounter : zIndexCounter + 1,
                }}
                default={{
                    x: position.x,
                    y: position.y,
                    width: size.width,
                    height: size.height,
                }}
                minWidth={420}
                minHeight={500}
                className="window"
                onClick={() => {
                    bringToFront();
                    setActiveWindow("main");
                }}
            >
                <div className="title-bar">
                    <div className="title-bar-text">Articles.exe</div>
                    <div className="title-bar-controls">
                        <button aria-label="Minimize" />
                        <button aria-label="Maximize" />
                        <button aria-label="Close" onClick={onClose} />
                    </div>
                </div>

                <div className="window-body">
                    <h3>La Crème</h3>
                    <div className="upper-section">
                        {featuredBlogs && featuredBlogs.data.map((blog) => (
                            <div key={blog.attributes.Title} className="icon-container">
                                <Icon
                                    title={blog.attributes.Title}
                                    iconPath={`${strapiBaseUrl}${blog.attributes.Icon.data.attributes.url}`}
                                    onClick={() => handleIconClick(blog.attributes.Title, "upper")}
                                />
                            </div>
                        ))}
                    </div>

<div className="section-divider"></div>

                    <h3>Les Articles</h3>
                    <div className="lower-section">
                        {blogs && blogs.data.map((blog) => (
                            <div key={blog.attributes.Title} className="icon-container">
                                <Icon
                                    title={blog.attributes.Title}
                                    iconPath={`${strapiBaseUrl}${blog.attributes.Icon.data.attributes.url}`}
                                    onClick={() => handleIconClick(blog.attributes.Title, "lower")}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="status-bar">
                    <p className="status-bar-field">SADFLOWER</p>
                    <p className="status-bar-field">Slide 1</p>
                    <p className="status-bar-field">CPU Usage: 14%</p>
                </div>
            </Rnd>

            {upperSectionWindows.map((window, index) => (
                <FeaturedWindow
                    key={index}
                    articleData={featuredBlogs.data.find(blog => blog.attributes.Title === window.title)}
                    closeWindow={() => handleCloseWindow(window, "upper")}
                    style={{ zIndex: activeWindow === window.title ? zIndexCounter : zIndexCounter + 1 }}
                    onClick={() => {
                        bringToFront();
                        setActiveWindow(window.title);
                    }}
                />
            ))}

            {lowerSectionWindows.map((window, index) => (
                <SimpleWindow
                    key={index}
                    articleData={blogs.data.find(blog => blog.attributes.Title === window.title)}
                    closeWindow={() => handleCloseWindow(window, "lower")}
                    style={{ zIndex: activeWindow === window.title ? zIndexCounter : zIndexCounter + 1 }}
                    onClick={() => {
                        bringToFront();
                        setActiveWindow(window.title);
                    }}
                />
            ))}
        </>
    );
};

export default ArticleExe;