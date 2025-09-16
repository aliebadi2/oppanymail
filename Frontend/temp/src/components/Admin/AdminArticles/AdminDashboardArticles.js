import React, { useState, useEffect } from 'react';
import './AdminDashboardArticles.css';
import axios from 'axios';
import config from '../../../config'; // Configuration for API paths
import ArticleForm from './ArticleForm'; // Import the form for adding articles

const AdminDashboardArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddingArticle, setIsAddingArticle] = useState(false); // Toggle form visibility

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await axios.get(`${config.path}/admin/articles`, {
        withCredentials: true,
      });
      setArticles(response.data);
    } catch (err) {
      setError('مشکلی در بارگیری مقالات وجود دارد.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteArticle = async (articleId) => {
    try {
      await axios.delete(`${config.path}/admin/articles/${articleId}`, {
        withCredentials: true,
      });
      setArticles(articles.filter((article) => article.id !== articleId));
    } catch (err) {
      alert('حذف مقاله ناموفق بود.');
    }
  };

  const handleArticleAdded = () => {
    fetchArticles();
    setIsAddingArticle(false);
  };

  return (
    <div className="admin-article-dashboard-container">
      <h1 className="admin-article-dashboard-title">مدیریت مقالات</h1>
      {error && <div className="admin-article-dashboard-error-message">{error}</div>}
      
      <div className="admin-article-dashboard-header">
        <button
          className="admin-article-dashboard-add-button"
          onClick={() => setIsAddingArticle(!isAddingArticle)}
        >
          {isAddingArticle ? 'لغو اضافه کردن' : 'افزودن مقاله جدید'}
        </button>
      </div>

      {isAddingArticle && <ArticleForm onSubmit={handleArticleAdded} />}

      {loading ? (
        <p className="admin-article-dashboard-loading-message">در حال بارگیری...</p>
      ) : (
        <div className="admin-article-dashboard-table-container">
          <table className="admin-article-dashboard-table">
            <thead>
              <tr>
                <th>عنوان</th>
                <th>تگ</th>
                <th>نویسنده</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.id}>
                  <td>{article.title}</td>
                  <td>{article.tag}</td>
                  <td>{article.author_name}</td>
                  <td className="admin-article-dashboard-actions">
                    <button className="admin-article-dashboard-edit-button">ویرایش</button>
                    <button
                      className="admin-article-dashboard-delete-button"
                      onClick={() => handleDeleteArticle(article.id)}
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardArticles;
