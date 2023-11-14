import Image from "next/image";
import React, { useState } from "react";
import config from "@/src/config";
import { Rnd } from "react-rnd";
import styles from '@/styles/utils/style.module.sass'
import "98.css";
import "/styles/system32/windows/window.sass";

const FeaturedWindow = ({ articleData, closeWindow }) => {
    const [zIndex, setZIndex] = useState(1);

    const bringToFront = () => {
        setZIndex((prevZIndex) => prevZIndex + 1);
    };

    return (
        <>
            <Rnd
                style={{
                    fontFamily: "Arial, sans-serif",
                    zIndex: zIndex,
                }}
                default={{
                    x: 0,
                    y: 0,
                    width: 350,
                    height: 220,
                }}
                minWidth={350}
                minHeight={65}
                className="window"
                onMouseDownCapture={bringToFront}
                onDragStart={bringToFront}
            >
                <div className="title-bar">
                    <div className="title-bar-text">🌟{articleData.attributes.Title}🌟</div>
                    <div className="title-bar-controls">
                        <button aria-label="Minimize" />
                        <button aria-label="Maximize" />
                        <button aria-label="Close" onClick={closeWindow} />
                    </div>
                </div>

                <div className="window-body">
                    <div className="fenetre-article">
                        {articleData && articleData.attributes && (
                            <>
                                <h2>{articleData.attributes.Title}</h2>
                                <hr />
                                <p>{articleData.attributes.Summary}</p>
                                <hr />
                                <p>{articleData.attributes.Content}</p>
                                <hr />
                                <Image
                                    className={`${styles.stylepourdetails} mb-50`}
                                    src={`${config.api}${articleData.attributes.FeaturedImage.data.attributes.url}`}
                                    alt="6"
                                    width="1050"
                                    height="387" />
                            </>
                        )}
                    </div>
                </div>
                <div className="status-bar">
                    <p className="status-bar-field">{articleData.attributes.Category}</p>
                    <p className="status-bar-field">Slide 1</p>
                    <p className="status-bar-field">CPU Usage: 14%</p>
                </div>
            </Rnd>
        </>
    );
};

export default FeaturedWindow;
