import React, { useState } from 'react';
import './ArticleForm.css';
import axios from 'axios';
import config from '../../../config';

const ArticleForm = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('');
  const [mainTitle, setMainTitle] = useState('');
  const [error, setError] = useState('');

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!title || !mainTitle) {
      setError('لطفاً تمام فیلدها را پر کنید.');
      return;
    }

    try {
      const articleData = { title, main_title: mainTitle, tag };
      await axios.post(`${config.path}/admin/articles`, articleData, {
        withCredentials: true,
      });
      onSubmit();
    } catch {
      setError('ایجاد مقاله ناموفق بود.');
    }
  };

  return (
    <div className="admin-article-dashboard-form-container">
      <h2 className="admin-article-dashboard-form-title">ایجاد مقاله جدید</h2>
      {error && <p className="admin-article-dashboard-error-message">{error}</p>}
      <form onSubmit={handleFormSubmit} className="admin-article-dashboard-form">
        <div className="admin-article-dashboard-form-group">
          <label>عنوان</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="admin-article-dashboard-input"
          />
        </div>
        <div className="admin-article-dashboard-form-group">
          <label>عنوان اصلی</label>
          <input
            type="text"
            value={mainTitle}
            onChange={(e) => setMainTitle(e.target.value)}
            className="admin-article-dashboard-input"
          />
        </div>
        <div className="admin-article-dashboard-form-group">
          <label>تگ</label>
          <input
            type="text"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className="admin-article-dashboard-input"
          />
        </div>
        <button type="submit" className="admin-article-dashboard-submit-button">ایجاد</button>
      </form>
    </div>
  );
};

export default ArticleForm;
