import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../../../config";
import "./MenteeSessions.css";

const MenteeSession = () => {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axios.get(`${config.path}/mentee/active_sessions`, {
          withCredentials: true,
        });
        setSessions(response.data);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    };
    fetchSessions();
  }, []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="mentee-session-container">
      <h2 className="mentee-session-title">جلسات منتی</h2>

      <div className="mentee-session-table-container">
        <table className="mentee-session-table">
          <thead>
            <tr>
              <th>نام منتور</th>
              <th>عنوان دوره</th>
              <th>وضعیت جلسه</th>
              <th>زمان جلسه</th>
              <th>ورود به دوره</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session, index) => (
              <tr key={index}>
                <td>{`${session.mentor_name} ${session.mentor_family_name}`}</td>
                <td>{`Session ${session.session_id}`}</td>
                <td>{session.status === "active" ? "فعال" : "غیرفعال"}</td>
                <td>{formatDate(session.scheduled_time)}</td>
                <td>
                  <button onClick={() => alert(`Redirecting to session ${session.session_id}`)}>
                    ورود به دوره
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MenteeSession;
