import React, { useState, useEffect } from 'react';
import RND, { Rnd } from 'react-rnd';
import Header from '@/components/header';
import fetchBlogs from '@/src/app/helpers/fetch-blogs'; // Importe ta fonction pour récupérer les articles
import SimpleWindow from '@/components/system32/windows/simplewindow';

import "@/styles/styles.sass";

function About() {
    const [articleData, setArticleData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const [blogs] = await Promise.all([
                await fetchBlogs()
            ]);
            // Vérifie que blogs.data est défini et qu'il a au moins un élément
            if (blogs && blogs.data && blogs.data.length > 0) {
                const selectedArticle = blogs.data[1];
                setArticleData(selectedArticle);
            }
        }
        fetchData();
    }, []);

    return (
        <div>
        <SimpleWindow />
        <Rnd
            default={{
                x: 0,
                y: 0,
                width: 320,
                height: 200,
            }}
            minWidth={200}
            minHeight={150}
            style={{ border: '2px solid #000' }}
        >
            <div className="fenetre-article">
                {articleData && articleData.attributes && (
                    <>
                        <h2>{articleData.attributes.Title}</h2>
                        <hr />
                        <p>{articleData.attributes.Summary}</p>
                    </>
                )}
            </div>
        </Rnd>
        </div>
    );
}
export default About;