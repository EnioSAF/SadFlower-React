import React, { useState, useEffect } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import fetchBlogs from '@/src/app/helpers/fetch-blogs'; // Importe ta fonction pour récupérer les articles
import Window from '@/components/system32/windows/simplewindow';

// import "@/styles/styles.sass";
import "98.css";

function About() {
    const [articleData, setArticleData] = useState(null);

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
            {articleData && <Window articleData={articleData} />}
        </div>
    );
}
export default About;
