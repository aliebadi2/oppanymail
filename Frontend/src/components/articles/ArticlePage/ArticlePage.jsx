import React, { useState, useEffect } from 'react';
import './ArticlePage.css';
import defaultImage from '../../../assets/Image.png';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import config from '../../../config'; // Adjust import path as needed

const ArticlePage = () => {
  const [articleContent, setArticleContent] = useState([]);
  const [mainTitle, setMainTitle] = useState('');
  const [writer, setWriter] = useState({ name: '', username: '', image: defaultImage });
  const { articleId } = useParams();

  useEffect(() => {
    axios
      .get(`${config.path}/articles/${articleId}`, { withCredentials: true })
      .then(response => {
        const article = response.data;
        setMainTitle(article.main_title);

        // The API might return author_name, author_username, etc.
        // If you store them differently, adjust here.
        setWriter({
          name: article.author_name || '',
          username: article.author_username || '',
          image: defaultImage,
        });

        const sortedContents = article.contents.sort((a, b) => a.order - b.order);
        setArticleContent(sortedContents);
      })
      .catch(error => {
        console.error('Error fetching article:', error);
      });
  }, [articleId]);

  // Fetch the writer’s profile image (optional, depends on your backend endpoint)
  useEffect(() => {
    if (writer.username) {
      axios
        .get(`${config.path}/profile_image/${writer.username}`, {
          responseType: 'blob',
          withCredentials: true,
        })
        .then(response => {
          const imageUrl = URL.createObjectURL(response.data);
          setWriter(prev => ({ ...prev, image: imageUrl }));
        })
        .catch(error => {
          console.error('Error fetching writer profile image:', error);
        });
    }
  }, [writer.username]);

  const renderContent = (item, index) => {
    switch (item.content_type) {
      case 'header':
        return (
          <h1 key={index} className="article-page-content-header">
            {item.content}
          </h1>
        );
      case 'paragraph':
        return (
          <p className="article-page-paragraph" key={index}>
            {item.content}
          </p>
        );
      case 'image':
        return (
          <div className="article-page-image-container" key={index}>
            <img
              className="article-page-image"
              src={item.src || defaultImage}
              alt={item.alt || 'Default description'}
              onError={e => {
                e.target.onerror = null;
                e.target.src = defaultImage;
              }}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="article-page-container">
      <header className="article-page-header">
        <h1 className="article-page-main-title">{mainTitle}</h1>
        <div className="article-page-writer-info">
          <div className="article-page-profile-image-container">
            <img
              src={writer.image}
              alt={`${writer.name || 'Default'}'s profile`}
              className="article-page-writer-image"
              onError={e => {
                e.target.onerror = null;
                e.target.src = defaultImage;
              }}
            />
          </div>
          <span className="article-page-writer-name">{writer.name}</span>
        </div>
      </header>
      <div className="article-page-content">
        {articleContent.map((item, index) => renderContent(item, index))}
      </div>
    </div>
  );
};

export default ArticlePage;
