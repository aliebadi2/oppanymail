import React, { useState, useEffect } from "react";
import "./MentorSessions.css";
import Button from '../../../../Components/Button/Button.js'


const MentorSession = () => {
  const [activeTab, setActiveTab] = useState("allSessions");
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [newSession, setNewSession] = useState({
    menteeName: "",
    menteeUsername: "",
    startDate: "",
    endDate: "",
    paymentAmount: "",
    courseTitle: "",
  });

  useEffect(() => {
    const fetchSessions = async () => {
      const response = await fetch("/mentorSessions.json");
      const data = await response.json();
      setSessions(data);
    };
    fetchSessions();
  }, []);

  useEffect(() => {
    if (activeTab === "allSessions") {
      setFilteredSessions(sessions);
    } else {
      setFilteredSessions(sessions.filter((session) => session.activation));
    }
  }, [activeTab, sessions]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSession({ ...newSession, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSession),
      });

      if (response.ok) {
        alert("جلسه با موفقیت اضافه شد!");
        setShowPopup(false);
        setSessions([...sessions, newSession]);
      } else {
        alert("خطا در اضافه کردن جلسه");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="mentor-sessions-container">
      {/* Toggle Buttons */}
      <div className="mentor-sessions-toggle">
        <button
          className={activeTab === "allSessions" ? "active" : ""}
          onClick={() => handleTabChange("allSessions")}
        >
          همه جلسات
        </button>
        <button
          className={activeTab === "activeSessions" ? "active" : ""}
          onClick={() => handleTabChange("activeSessions")}
        >
          جلسات فعال
        </button>
        
      </div>

      {/* Table */}
      <div className="mentor-sessions-table-container">
        <table className="mentor-sessions-table">
          <thead>
            <tr>
              <th>منتی</th>
              <th>عنوان دوره</th>
              <th>مبلغ پرداختی</th>
              <th>زمان جلسه</th>
              <th>دسترسی به دوره</th>
            </tr>
          </thead>
          <tbody>
            {filteredSessions.map((session, index) => (
              <tr key={index}>
                <td>{session.menteeName}</td>
                <td>{session.courseTitle}</td>
                <td>{session.paymentAmount}</td>
                <td>{session.sessionTime}</td>
                <td>
                  <button
                    onClick={() =>
                      alert(`Navigating to course: ${session.courseTitle}`)
                    }
                  >
                    رفتن به دوره
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mentor-session-add-session-button-container">
          <Button
          buttonstyle="primary-buttonn"
          onClick={() => setShowPopup(true)}
          text=" +"
          />
        </div>
        
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>اضافه کردن دوره جدید</h3>
            <input
              type="text"
              name="menteeName"
              placeholder="نام منتی"
              value={newSession.menteeName}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="menteeUsername"
              placeholder="نام کاربری منتی"
              value={newSession.menteeUsername}
              onChange={handleInputChange}
            />
            <input
              type="date"
              name="startDate"
              value={newSession.startDate}
              onChange={handleInputChange}
            />
            <input
              type="date"
              name="endDate"
              value={newSession.endDate}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="paymentAmount"
              placeholder="مبلغ پرداخت شده"
              value={newSession.paymentAmount}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="courseTitle"
              placeholder="عنوان دوره"
              value={newSession.courseTitle}
              onChange={handleInputChange}
            />
            <div className="popup-buttons">
              <Button 
              onClick={handleSubmit}
              text="ثبت"
              buttonstyle="primary-buttonn"

               />
               <Button 
              onClick={() => setShowPopup(false)}
              text="لغو"
              buttonstyle="secondary-buttonn"

               />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorSession;
