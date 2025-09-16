import React, { useState, useEffect } from 'react';
import './ArticleSearch.css';
import ArticleCard from '../ArticleCard/ArticleCard';
import ArticleHeaderCard from '../ArticleHeaderCard/ArticleHeaderCard';
import articleExample from '../../../assets/loginImage.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import config from '../../../config'; // Adjust path as needed

const ArticleSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [articlesData, setArticlesData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${config.path}/articles/`, { withCredentials: true })
      .then(response => {
        setArticlesData(response.data);
      })
      .catch(error => {
        console.error('Error fetching articles:', error);
      });
  }, []);

  const filteredArticles = articlesData.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const articlesToDisplay = showAll ? filteredArticles : filteredArticles.slice(0, 9);

  const handleArticleClick = articleId => {
    navigate(`/articles/${articleId}`);
  };

  return (
    <div className="article-search-container">
      <div className="article-search-title-search-container">
        <h1 className="article-search-title">مقاله‌ها</h1>
        <div className="article-search-bar-container">
          <input
            type="text"
            placeholder="جستجوی مقاله..."
            className="article-search-input"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <button className="article-search-button">جستجو</button>
        </div>
      </div>
      <ArticleHeaderCard backgroundImageUrl={articleExample} />
      <div className="article-search-cards-container">
        {articlesToDisplay.map(article => (
          <div
            key={article.id}
            className="article-search-card-wrapper"
            onClick={() => handleArticleClick(article.id)}
          >
            <ArticleCard article={article} />
          </div>
        ))}
      </div>
      {filteredArticles.length > 9 && !showAll && (
        <div className="article-search-show-more-container">
          <button className="article-search-show-more-button" onClick={() => setShowAll(true)}>
            نمایش بیشتر
          </button>
        </div>
      )}
    </div>
  );
};

export default ArticleSearch;
