import React, { useState, useMemo, useEffect } from "react";
import { Rnd } from "react-rnd";
import Icon from "../../applications/icon";
import FeaturedWindow from "./featuredwindow";
import SimpleWindow from "./simplewindow";
import fetchBlogs from "@/components/Tools/Blog/fetch-blogs";

import "/styles/system32/windows/Articles/articlewindow.sass";
import "98.css";

const ArticleExe = ({ onClose, zIndex }) => {
  const [size, setSize] = useState({ width: 400, height: 300 });
  const [featuredBlogs, setFeaturedBlogs] = useState(null);
  const [blogs, setBlogs] = useState(null);
  const [upperSectionWindows, setUpperSectionWindows] = useState([]);
  const [lowerSectionWindows, setLowerSectionWindows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [featuredBlogsData, blogsData] = await Promise.all([
        fetchBlogs("filters[IsFeatured][$eq]=true"),
        fetchBlogs("filters[IsFeatured][$eq]=false"),
      ]);
      setFeaturedBlogs(featuredBlogsData);
      setBlogs(blogsData);
    };
    fetchData();
  }, []);

  // Fonction pour les icônes
  const handleIconClick = (articleTitle, section) => {
    if (previewArticle === articleTitle) {
      // C'est le second clic, on ouvre la fenêtre
      const newWindow = { title: articleTitle, section };
      if (section === "upper") {
        setUpperSectionWindows((prevWindows) => [...prevWindows, newWindow]);
      } else {
        setLowerSectionWindows((prevWindows) => [...prevWindows, newWindow]);
      }
      setPreviewArticle(null); // Reset pour le prochain article
    } else {
      // Premier clic, on affiche le résumé
      setPreviewArticle(articleTitle);
    }
  };

  // Fonction pour les résumés
  const [previewArticle, setPreviewArticle] = useState(null);
  const articlePreview = previewArticle ? featuredBlogs.data.concat(blogs.data).find(blog => blog.attributes.Title === previewArticle) : null;

  // Fonction pour les catégories
  const [currentCategory, setCurrentCategory] = useState('Toutes'); // 'Toutes' pour afficher tout au début
  const filteredBlogs = useMemo(() => {
    if (!blogs || !blogs.data) return []; // Si blogs ou blogs.data est null/undefined, on retourne un tableau vide pour éviter l'erreur

    let sortedBlogs = [...blogs.data].sort((a, b) => new Date(b.attributes.createdAt) - new Date(a.attributes.createdAt)); // Tri par date, du plus récent au plus ancien
    if (currentCategory === 'Toutes') {
      return sortedBlogs; // Tous les blogs si la catégorie est 'Toutes'
    }
    return sortedBlogs.filter(blog => blog.attributes.Category === currentCategory); // Filtrage par catégorie
  }, [blogs, currentCategory]);

  const uniqueCategories = useMemo(() => {
    if (!blogs || !blogs.data) return []; // Check si blogs est chargé
    const categories = blogs.data.map(blog => blog.attributes.Category); // Extrait les catégories
    return [...new Set(categories)]; // Magic Set pour virer les doublons, et t'as tes catégories uniques
  }, [blogs]);

  // Fonction pour la pagination
  const [currentPageFeatured, setCurrentPageFeatured] = useState(1);
  const [currentPageArticles, setCurrentPageArticles] = useState(1);
  const articlesPerPage = 5;
  const totalFeaturedPages = Math.ceil((featuredBlogs?.data?.length || 0) / articlesPerPage);
  const totalArticlesPages = Math.ceil((filteredBlogs.length || 0) / articlesPerPage);

  const currentFeaturedBlogs = useMemo(() => {
    const start = (currentPageFeatured - 1) * articlesPerPage;
    return featuredBlogs?.data?.slice(start, start + articlesPerPage) || [];
  }, [featuredBlogs, currentPageFeatured, articlesPerPage]);

  const currentArticlesBlogs = useMemo(() => {
    const start = (currentPageArticles - 1) * articlesPerPage;
    return filteredBlogs.slice(start, start + articlesPerPage);
  }, [filteredBlogs, currentPageArticles, articlesPerPage]);


  // Fonction pour vérifier la taille de l'écran
  const isMobileScreen = () => window.innerWidth <= 600;
  const getRandomPosition = () => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const x = Math.floor(Math.random() * (windowWidth - 350));
    const y = Math.floor(Math.random() * (windowHeight - 220));
    return { x, y };
  };

  // Fonction pour gérer le focus des fenêtres
  const [focusedWindows, setFocusedWindows] = useState([]);
  const [articleExeZIndex, setArticleExeZIndex] = useState(0);

  const handleWindowClick = (window) => {
    if (window === "ArticleExe") {
      // Si on clique sur ArticleExe, on la met en premier plan
      setArticleExeZIndex((prevZIndex) => prevZIndex + 1);
    } else {
      // Si on clique sur une autre fenêtre, on met à jour le tableau focusedWindows
      setFocusedWindows((prevWindows) =>
        [window, ...prevWindows.filter((w) => w !== window)].reverse(),
      );
    }
  };

  // Fonction pour fermer les fenêtres
  const handleCloseWindow = (window, section) => {
    if (section === "upper") {
      setUpperSectionWindows((prevWindows) =>
        prevWindows.filter((w) => w.title !== window.title),
      );
    } else {
      setLowerSectionWindows((prevWindows) =>
        prevWindows.filter((w) => w.title !== window.title),
      );
    }
  };

  return (
    <>
        {articlePreview && (
      <div className="article-preview">
        {articlePreview.attributes.Summary || "Résumé pas disponible"}
      </div>
    )}
      <Rnd
        style={{
          fontFamily: "Arial, sans-serif",
          zIndex: zIndex,
        }}
        default={{
          ...getRandomPosition(),
          width: 430,
          height: 700,
        }}
        minWidth={350}
        minHeight={220}
        className='window'
        position={isMobileScreen()}
        disableDragging={isMobileScreen()}
      >
        <div className='title-bar'>
          <div className='title-bar-text'>Articles.exe</div>
          <div className='title-bar-controls'>
            <button aria-label='Minimize' />
            <button aria-label='Maximize' />
            <button
              aria-label='Close'
              onClick={onClose}
              onTouchStart={onClose}
            />
          </div>
        </div>

        <div className='window-body'>
          <div className="titre-sectionsarticles">
            <h3>La Crème</h3>
          </div>
          <div className='upper-section'>
            {currentFeaturedBlogs.map((blog) => (
              <div key={blog.attributes.Title} className='icon-container'>
                <Icon
                  title={blog.attributes.Title}
                  iconPath={`${blog.attributes.Icon.data.attributes.url}`}
                  onClick={() => handleIconClick(blog.attributes.Title, "upper")}
                  onTouchStart={() => handleIconClick(blog.attributes.Title, "upper")}
                />
              </div>
            ))}
            <div className="pagination">
              <button onClick={() => setCurrentPageFeatured(prev => Math.max(prev - 1, 1))} disabled={currentPageFeatured === 1}>Précédent</button>
              <button onClick={() => setCurrentPageFeatured(prev => Math.min(prev + 1, totalFeaturedPages))} disabled={currentPageFeatured === totalFeaturedPages}>Suivant</button>
              <div className="pagination-number">Page {currentPageFeatured} sur {totalFeaturedPages}</div> {/* Affichage du numéro de page et du total */}
            </div>
          </div>

          <div className='section-divider'></div>

          <div className="titre-sectionsarticles">
            <h3>Les Articles</h3>
          </div>
          <div className='lower-section'>
            <div className="categories-selector">
              <select onChange={(e) => setCurrentCategory(e.target.value)} value={currentCategory}>
                <option value="Toutes">Toutes</option>
                {uniqueCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            {currentArticlesBlogs.map((blog) => (
              <div key={blog.attributes.Title} className='icon-container'>
                <Icon
                  title={blog.attributes.Title}
                  iconPath={`${blog.attributes.Icon.data.attributes.url}`}
                  onClick={() => handleIconClick(blog.attributes.Title, "lower")}
                  onTouchStart={() => handleIconClick(blog.attributes.Title, "lower")}
                />
              </div>
            ))}
            <div className="pagination">
              <button onClick={() => setCurrentPageArticles(prev => Math.max(prev - 1, 1))} disabled={currentPageArticles === 1}>Précédent</button>
              <button onClick={() => setCurrentPageArticles(prev => Math.min(prev + 1, totalArticlesPages))} disabled={currentPageArticles === totalArticlesPages}>Suivant</button>
              <div className="pagination-number">Page {currentPageArticles} sur {totalArticlesPages}</div> {/* Affichage du numéro de page et du total */}
            </div>
          </div>
        </div>
        <div className='status-bar'>
          <p className='status-bar-field'>SADFLOWER</p>
          <p className='status-bar-field'>BlogMode : on</p>
          <p className='status-bar-field'>CPU Usage: 66%</p>
        </div>
      </Rnd>

      {upperSectionWindows.map((window, index) => (
        <FeaturedWindow
          key={index}
          articleData={featuredBlogs.data.find(blog => blog.attributes.Title === window.title)}
          closeWindow={() => handleCloseWindow(window, "upper")}
          onClick={() => handleWindowClick(window.title)}
          zIndex={index + 1} // Ajuste selon la logique de zIndex que tu souhaites
        />
      ))}

      {lowerSectionWindows.map((window, index) => (
        <SimpleWindow
          key={index}
          articleData={blogs.data.find(blog => blog.attributes.Title === window.title)}
          closeWindow={() => handleCloseWindow(window, "lower")}
          onClick={() => handleWindowClick(window.title)}
          zIndex={index + 1} // Ajuste selon la logique de zIndex que tu souhaites
        />
      ))}
    </>
  );
};

export default ArticleExe;
