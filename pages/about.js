import React, { useState, useEffect } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import fetchBlogs from '@/src/app/helpers/fetch-blogs'; // Importe ta fonction pour récupérer les articles
import Window from '@/components/system32/windows/simplewindow';
import FeaturedWindow from '@/components/system32/windows/featuredwindow';

import "98.css";

function About() {
    const [featuredBlogs, setFeaturedBlogs] = useState(null);
    const [blogs, setBlogs] = useState(null);

    useEffect(() => { //Fonction pour fetch les articles
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

    return ( //Affichage de la page
        <div>
            <div>
                {featuredBlogs && featuredBlogs.data.map((blog, index) => (
                    <FeaturedWindow key={index} articleData={blog} />
                ))}
            </div>
            <div>
                {blogs && blogs.data.map((blog, index) => (
                    <Window key={index} articleData={blog} />
                ))}
            </div>
        </div>
    );
}

export default About;
