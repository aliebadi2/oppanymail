import React from 'react';
import './ArticleHeaderCard.css';

const ArticleHeaderCard = ({ backgroundImageUrl, writerName, date, tag, title, writerImage }) => {
  return (
    <div
      className="article-page-header-card-component"
      style={{
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '300px',
      }}
    >
      <div className="article-page-header-card-information-container">
        <div className="article-page-header-card-spec-tag">{tag}</div>
        <h2 className="article-page-header-card-title-container">{title}</h2>

        <div className="article-page-header-writer-information">
          <div className="article-page-header-writer-name-profile">
            <div className="article-page-header-profile-container">
              <img
                src={writerImage}
                alt="article writer profile"
                className="article-page-header-profile-image"
              />
            </div>
            <p className="article-page-header-writer-name">{writerName}</p>
          </div>
          <p className="article-page-header-date">{date}</p>
        </div>
      </div>
    </div>
  );
};

export default ArticleHeaderCard;
