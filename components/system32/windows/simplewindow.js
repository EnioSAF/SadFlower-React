import React from "react";
import { Rnd } from "react-rnd";
import "98.css";

const Window = ({ articleData }) => {
    return (
        <Rnd
            default={{
                x: 0,
                y: 0,
                width: 320,
                height: 200,
            }}
            minWidth={200}
            minHeight={150}
            style={{
                border: '2px solid #000',
                fontFamily: 'Arial, sans-serif',
            }}
            className="window"
        >
            <div className="title-bar">
                <div className="title-bar-text">{articleData.attributes.Title}</div>
                <div className="title-bar-controls">
                    <button aria-label="Minimize" />
                    <button aria-label="Maximize" />
                    <button aria-label="Close" />
                </div>
            </div>

            <div className="window-body">
                <div className="fenetre-article">
                    {articleData && articleData.attributes && (
                        <>
                            <h2>{articleData.attributes.Title}</h2>
                            <hr />
                            <p>{articleData.attributes.Summary}</p>
                        </>
                    )}
                </div>
            </div>
        </Rnd>
    );
};

export default Window;
