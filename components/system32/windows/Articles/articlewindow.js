import React, { useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import { useZIndex } from "@/components/Tools/ZIndexContext";

import FeaturedWindow from "./featuredwindow";
import SimpleWindow from "./simplewindow";
import fetchBlogs from "@/components/Tools/Blog/fetch-blogs";

import "/styles/system32/windows/Articles/articlewindow.sass";
import "98.css";

const ArticleExe = ({ onClose }) => {
  const [featuredBlogs, setFeaturedBlogs] = useState(null);
  const [blogs, setBlogs] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [articleWindows, setArticleWindows] = useState([]);
  const [currentCategoryFeatured, setCurrentCategoryFeatured] = useState('All');
  const [currentCategoryArticles, setCurrentCategoryArticles] = useState('All');
  const [categoriesFeatured, setCategoriesFeatured] = useState([]);
  const [categoriesArticles, setCategoriesArticles] = useState([]);
  const [currentPageFeatured, setCurrentPageFeatured] = useState(1);
  const [currentPageArticles, setCurrentPageArticles] = useState(1);
  const articlesPerPage = 5; // Nombre d'articles par page

  // Pour gérer le Z-index
  const { bringToFront, zIndex: globalZIndex } = useZIndex();
  const [zIndex, setZIndex] = useState(globalZIndex);

  const updateZIndex = () => {
    const newZIndex = bringToFront(); // Cette fonction devrait maintenant te retourner et setter le nouveau Z-index global
    setZIndex(newZIndex); // Met à jour le Z-index local avec la nouvelle valeur
  };

  // Pour aller chercher les articles
  useEffect(() => {
    const fetchData = async () => {
      const [featuredBlogsResponse, blogsResponse] = await Promise.all([
        fetchBlogs("filters[IsFeatured][$eq]=true"),
        fetchBlogs("filters[IsFeatured][$eq]=false"),
      ]);
      // Supposons que fetchBlogs renvoie un objet avec un champ data contenant les articles
      const featuredBlogsData = featuredBlogsResponse.data;
      const blogsData = blogsResponse.data;

      setFeaturedBlogs(featuredBlogsResponse);
      setBlogs(blogsResponse);

      // Extraction et mise en place des catégories uniques
      const featuredCategories = [...new Set(featuredBlogsData.map(blog => blog.attributes.Category))];
      const articleCategories = [...new Set(blogsData.map(blog => blog.attributes.Category))];
      setCategoriesFeatured(['All', ...featuredCategories]);
      setCategoriesArticles(['All', ...articleCategories]);
    };
    fetchData();
  }, []);

  // Pour le tableau d'article
  const handleRowClick = (articleTitle, isFeatured) => {
    setArticleWindows(prevWindows => [
      ...prevWindows,
      { title: articleTitle, isFeatured, zIndex: prevWindows.length + 1 }
    ]);
  };

  // Fonction pour les catégories
  const renderTabs = (categories, currentCategory, setCurrentCategory) => (
    <menu role="tablist" className="menu">
      {categories.map((category) => (
        <li role="tab" key={category} className={`tab ${currentCategory === category ? 'active' : ''}`} onClick={() => setCurrentCategory(category)}>
          <a href="#tabs">{category}</a>
        </li>
      ))}
    </menu>
  );

  // Fonction pour rendre le tableau d'articles
  const renderTableRows = (data, isFeatured, currentPage, currentCategory) => {
    if (!data) return null;

    // Ici, data devrait directement être le tableau d'articles, donc pas besoin de data.data
    const start = (currentPage - 1) * articlesPerPage;
    let filteredData = currentCategory === 'All'
      ? data
      : data.filter(blog => blog.attributes.Category === currentCategory);

    const paginatedData = filteredData.slice(start, start + articlesPerPage);

    return paginatedData.map((blog) => (
      <tr key={blog.id} onClick={() => handleRowClick(blog.attributes.Title, isFeatured)}>
        <td>{blog.attributes.Title}</td>
        <td>{new Date(blog.attributes.createdAt).toLocaleDateString()}</td>
        <td>{blog.attributes.Category}</td>
        <td>{blog.attributes.Summary}</td>
      </tr>
    ));
  };

  // Fonction pour changer la page des articles en vedette
  const changeFeaturedPage = (newPage) => {
    setCurrentPageFeatured(newPage);
  };

  // Fonction pour changer la page des autres articles
  const changeArticlesPage = (newPage) => {
    setCurrentPageArticles(newPage);
  };

  // Calcul du nombre total de pages
  const totalFeaturedPages = Math.ceil((featuredBlogs?.data?.length || 0) / articlesPerPage) || 1;
  const totalArticlesPages = Math.ceil((blogs?.data?.length || 0) / articlesPerPage) || 1;

  // Fonction pour fermer les fenêtres
  const handleCloseWindow = (windowTitle) => {
    setArticleWindows(prevWindows => prevWindows.filter(window => window.title !== windowTitle));
  };

  // Fonction pour vérifier la taille de l'écran
  const isMobileScreen = () => window.innerWidth <= 600;

  // Fonction pour centrer la fenêtre
  const getCenterPosition = () => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const x = (windowWidth - 350) / 2;
    const y = (windowHeight - 220) / 2;

    return { x, y };
  };

  return (
    <>
      <Rnd
        style={{
          zIndex: zIndex
        }}
        default={{
          ...getCenterPosition(),
          width: 540,
          height: 628,
        }}
        minWidth={350}
        minHeight={220}
        className='window'
        onClick={updateZIndex}
        disableDragging={isMobileScreen()}
        position={isMobileScreen()}
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
          {/* La Crème */}
          <div className="upper-section">
            <div className="titre-sectionsarticles">
              <h3>La Crème</h3>
            </div>
            {renderTabs(categoriesFeatured, currentCategoryFeatured, setCurrentCategoryFeatured)}
            <div className="table-container">
              <table className="interactive">
                <thead>
                  <tr>
                    <th>Titre</th>
                    <th>Date</th>
                    <th>Catégorie</th>
                    <th>Résumé</th>
                  </tr>
                </thead>
                <tbody>
                  {renderTableRows(featuredBlogs?.data, true, currentPageFeatured, currentCategoryFeatured)}
                </tbody>
              </table>
            </div>
            <div className="pagination">
              <button onClick={() => changeFeaturedPage(Math.max(1, currentPageFeatured - 1))}>Précédent</button>
              <span>Page {currentPageFeatured} sur {totalFeaturedPages}</span>
              <button onClick={() => changeFeaturedPage(Math.min(totalFeaturedPages, currentPageFeatured + 1))}>Suivant</button>
            </div>
          </div>

          <div className='section-divider'></div>

          {/* Les Articles */}
          <div className="lower-section">
            <div className="titre-sectionsarticles">
              <h3>Les Articles</h3>
            </div>
            {renderTabs(categoriesArticles, currentCategoryArticles, setCurrentCategoryArticles)}
            <div className="table-container">
              <table className="interactive">
                <thead>
                  <tr>
                    <th>Titre</th>
                    <th>Date</th>
                    <th>Catégorie</th>
                    <th>Résumé</th>
                  </tr>
                </thead>
                <tbody>
                  {renderTableRows(blogs?.data, false, currentPageArticles, currentCategoryArticles)}
                </tbody>
              </table>
            </div>
            <div className="pagination">
              <button onClick={() => changeArticlesPage(Math.max(1, currentPageArticles - 1))}>Précédent</button>
              <span>Page {currentPageArticles} sur {totalArticlesPages}</span>
              <button onClick={() => changeArticlesPage(Math.min(totalArticlesPages, currentPageArticles + 1))}>Suivant</button>
            </div>
          </div>
          <div className='status-bar'>
            <p className='status-bar-field'>Articles</p>
            <p className='status-bar-field'>ReadMode : on</p>
            <p className='status-bar-field'>CPU Usage: 10%</p>
          </div>
        </div>
      </Rnd>

      {/* Gérer l'affichage des fenêtres d'articles */}
      {articleWindows.map((window, index) => (
        window.isFeatured ? (
          <FeaturedWindow
            key={index}
            zIndex={window.zIndex}
            articleData={featuredBlogs.data.find(blog => blog.attributes.Title === window.title)}
            closeWindow={() => handleCloseWindow(window.title)}
          />
        ) : (
          <SimpleWindow
            key={index}
            zIndex={window.zIndex}
            articleData={blogs.data.find(blog => blog.attributes.Title === window.title)}
            closeWindow={() => handleCloseWindow(window.title)}
          />
        )
      ))}
    </>
  );
};

export default ArticleExe;