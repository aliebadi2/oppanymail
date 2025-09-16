import React from 'react';
import './ArticleCard.css';
import defaultArticleImage from '../../../assets/Image.png';
import defaultAuthorImage from '../../../assets/Image.png';

const ArticleCard = ({ article }) => {
  // The API should return `article.title`, `article.tag`, `article.author_name`, etc.
  // If your API uses different field names for images, adjust accordingly.
  return (
    <div className="article-page-card-container">
      <div className="article-page-card-image-container">
        <img
          src={article.articleImage || defaultArticleImage}
          alt={article.title}
          className="article-page-card-image"
          onError={e => {
            e.target.onerror = null;
            e.target.src = defaultArticleImage;
          }}
        />
      </div>
      <div className="article-page-card-spec-tag">{article.tag}</div>
      <h2 className="article-page-card-title-container">{article.title}</h2>
      <div className="article-page-card-poster-information">
        <div className="article-page-card-poster-profile-image-container">
          <img
            src={article.authorImage || defaultAuthorImage}
            alt={article.author_name}
            className="article-page-card-poster-profile-image"
            onError={e => {
              e.target.onerror = null;
              e.target.src = defaultAuthorImage;
            }}
          />
        </div>
        <div className="article-page-card-poster-information-container">
          <p className="article-page-card-poster-name">{article.author_name}</p>
          <p className="article-page-card-poster-date">
            {new Date(article.date).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
