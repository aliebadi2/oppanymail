// src/components/AdminCreate.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminCreat.css";

const API_BASE_URL = "http://localhost:8000/admin/blog"; // Change this to your actual API URL

const AdminCreate = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [newBlog, setNewBlog] = useState({
    blog_title: "",
    blog_explanation: "",
    writer_name: "",
    tags: "",
    blog_image: null,
    writer_image: null,
  });

  const [newContent, setNewContent] = useState({
    content_type: "header",
    content: "",
    content_number: 1,
    image: null,
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    const response = await axios.get(`${API_BASE_URL}/`);
    setBlogs(response.data);
  };

  const handleCreateBlog = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (let key in newBlog) {
      if (newBlog[key]) formData.append(key, newBlog[key]);
    }

    await axios.post(`${API_BASE_URL}/create_blog`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setNewBlog({
      blog_title: "",
      blog_explanation: "",
      writer_name: "",
      tags: "",
      blog_image: null,
      writer_image: null,
    });

    fetchBlogs();
  };

  const handleDeleteBlog = async (blog_id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      await axios.delete(`${API_BASE_URL}/${blog_id}`);
      setSelectedBlog(null);
      fetchBlogs();
    }
  };

  const handleCreateContent = async (e) => {
    e.preventDefault();
    if (!selectedBlog) return;

    const formData = new FormData();
    formData.append("content_type", newContent.content_type);
    formData.append("content_number", newContent.content_number);
    if (newContent.content_type === "image") {
      formData.append("image", newContent.image);
    } else {
      formData.append("content", newContent.content);
    }

    await axios.post(`${API_BASE_URL}/${selectedBlog.blog_id}/content`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setNewContent({ content_type: "header", content: "", content_number: 1, image: null });
    fetchBlogs();
  };

  return (
    <div className="admin-container">
      <h1>Admin Blog Manager</h1>

      <div className="blog-list">
        <h2>All Blogs</h2>
        {blogs.map((blog) => (
          <div
            key={blog.blog_id}
            className="blog-card"
            onClick={() => setSelectedBlog(blog)}
          >
            <h3>{blog.blog_title}</h3>
            <p>{blog.writer_name}</p>
          </div>
        ))}
      </div>

      <div className="blog-form">
        <h2>Create New Blog</h2>
        <form onSubmit={handleCreateBlog}>
          <input
            type="text"
            placeholder="Blog Title"
            value={newBlog.blog_title}
            onChange={(e) => setNewBlog({ ...newBlog, blog_title: e.target.value })}
          />
          <textarea
            placeholder="Explanation"
            value={newBlog.blog_explanation}
            onChange={(e) => setNewBlog({ ...newBlog, blog_explanation: e.target.value })}
          />
          <input
            type="text"
            placeholder="Writer Name"
            value={newBlog.writer_name}
            onChange={(e) => setNewBlog({ ...newBlog, writer_name: e.target.value })}
          />
          <input
            type="file"
            onChange={(e) => setNewBlog({ ...newBlog, blog_image: e.target.files[0] })}
          />
          <input
            type="file"
            onChange={(e) => setNewBlog({ ...newBlog, writer_image: e.target.files[0] })}
          />
          <button type="submit">Create Blog</button>
        </form>
      </div>

      {selectedBlog && (
        <div className="blog-details">
          <h2>{selectedBlog.blog_title}</h2>
          <button onClick={() => handleDeleteBlog(selectedBlog.blog_id)}>Delete Blog</button>

          <h3>Contents</h3>
          {selectedBlog.contents.map((content) => (
            <div key={content.content_id} className="content-item">
              <p>{content.content_type.toUpperCase()}</p>
              {content.content_type === "image" ? (
                <img src={content.content} alt="Content" />
              ) : (
                <p>{content.content}</p>
              )}
            </div>
          ))}

          <h3>Add Content</h3>
          <form onSubmit={handleCreateContent}>
            <select
              value={newContent.content_type}
              onChange={(e) => setNewContent({ ...newContent, content_type: e.target.value })}
            >
              <option value="header">Header</option>
              <option value="paragraph">Paragraph</option>
              <option value="image">Image</option>
            </select>
            {newContent.content_type === "image" ? (
              <input type="file" onChange={(e) => setNewContent({ ...newContent, image: e.target.files[0] })} />
            ) : (
              <textarea
                placeholder="Content"
                value={newContent.content}
                onChange={(e) => setNewContent({ ...newContent, content: e.target.value })}
              />
            )}
            <input
              type="number"
              placeholder="Content Order"
              value={newContent.content_number}
              onChange={(e) => setNewContent({ ...newContent, content_number: e.target.value })}
            />
            <button type="submit">Add Content</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminCreate;
