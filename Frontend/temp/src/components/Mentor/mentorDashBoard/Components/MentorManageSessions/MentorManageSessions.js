import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MentorManageSessions.css";
import config from "../../../../../config";

const MentorManageSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [newSession, setNewSession] = useState({
    title: "",
    description: "",
    session_time: "",
    price: "",
  });
  const [editSessionId, setEditSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${config.path}/mentor/sessions`, {
        withCredentials: true,
      });
      setSessions(response.data);
    } catch (err) {
      setError("مشکلی در بارگذاری جلسات وجود دارد.");
    } finally {
      setLoading(false);
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    setEditSessionId(null);
    setNewSession({
      title: "",
      description: "",
      session_time: "",
      price: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSession((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateOrUpdateSession = async () => {
    try {
      if (editSessionId) {
        await axios.put(
          `${config.path}/mentor/sessions/${editSessionId}`,
          newSession,
          { withCredentials: true }
        );
      } else {
        await axios.post(`${config.path}/mentor/sessions`, newSession, {
          withCredentials: true,
        });
      }
      fetchSessions();
      toggleForm();
    } catch (err) {
      setError("خطا در ایجاد یا به‌روزرسانی جلسه.");
    }
  };

  const handleEditSession = (session) => {
    setEditSessionId(session.id);
    setNewSession({
      title: session.title,
      description: session.description,
      session_time: session.session_time,
      price: session.price,
    });
    setShowForm(true);
  };

  const handleDeleteSession = async (sessionId) => {
    try {
      await axios.delete(`${config.path}/mentor/sessions/${sessionId}`, {
        withCredentials: true,
      });
      fetchSessions();
    } catch (err) {
      setError("خطا در حذف جلسه.");
    }
  };

  return (
    <div className="mentor-manage-sessions-container">
      <h2>مدیریت جلسات</h2>
      <button className="mentor-manage-sessions-add-button" onClick={toggleForm}>
        {showForm ? "بستن" : "+ افزودن جلسه"}
      </button>

      {loading ? (
        <p>در حال بارگذاری...</p>
      ) : error ? (
        <p className="mentor-manage-sessions-error-message">{error}</p>
      ) : (
        <div className="mentor-manage-sessions-table-container">
          <table className="mentor-manage-sessions-table">
            <thead>
              <tr>
                <th>عنوان</th>
                <th>توضیحات</th>
                <th>زمان جلسه (دقیقه)</th>
                <th>قیمت (تومان)</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
                <tr key={session.id}>
                  <td>{session.title}</td>
                  <td>{session.description}</td>
                  <td>{session.session_time} دقیقه</td>
                  <td>{session.price} تومان</td>
                  <td>
                    <button onClick={() => handleEditSession(session)}>
                      ویرایش
                    </button>
                    <button onClick={() => handleDeleteSession(session.id)}>
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="mentor-manage-sessions-modal">
          <div className="mentor-manage-sessions-modal-content">
            <span className="mentor-manage-sessions-close" onClick={toggleForm}>
              &times;
            </span>
            <h3>{editSessionId ? "ویرایش جلسه" : "ایجاد جلسه جدید"}</h3>
            <input
              type="text"
              name="title"
              placeholder="عنوان"
              value={newSession.title}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="description"
              placeholder="توضیحات"
              value={newSession.description}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="session_time"
              placeholder="زمان جلسه (دقیقه)"
              value={newSession.session_time}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="price"
              placeholder="قیمت (تومان)"
              value={newSession.price}
              onChange={handleInputChange}
            />
            <button onClick={handleCreateOrUpdateSession}>
              {editSessionId ? "به‌روزرسانی" : "ایجاد"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorManageSessions;
