import React, { useState, useEffect } from 'react';
import RND, { Rnd } from 'react-rnd';
import Header from '@/components/header';
import "@/styles/styles.sass";
import fetchBlogs from '@/src/app/helpers/fetch-blogs'; // Importe ta fonction pour récupérer les articles

function About() {
    const [articleData, setArticleData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            console.log("Fetching data")
            const [blogs] = await Promise.all([
                await fetchBlogs()
            ]);
            console.log("blogs: ", blogs);
            // Vérifie que blogs.data est défini et qu'il a au moins un élément
            if (blogs && blogs.data && blogs.data.length > 0) {
                const selectedArticle = blogs.data[1];
                console.log("selectedArticle: ", selectedArticle)
                setArticleData(selectedArticle);
            }
        }
        fetchData();
    }, []);

    console.log(articleData)
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
    );
    console.log(articleData);
}
export default About;