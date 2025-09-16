import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MenteeCheckRequests.css";
import config from "../../../../config";

const MenteeCheckRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showDetails, setShowDetails] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    fetchRequests(activeTab);
  }, [activeTab]);

  const fetchRequests = async (tab) => {
    setLoading(true);
    setError("");
    try {
      const endpoint = `${config.path}/mentee/check_requests${tab !== "all" ? `/${tab}` : ""}`;
      const response = await axios.get(endpoint, { withCredentials: true });
      setRequests(response.data);
    } catch (err) {
      setError("مشکلی در بارگذاری درخواست‌ها وجود دارد.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = async (requestId) => {
    try {
      await axios.delete(`${config.path}/mentee/check_requests/${requestId}/cancel`, { withCredentials: true });
      fetchRequests(activeTab);
    } catch (err) {
      setError("خطا در لغو درخواست.");
    }
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowDetails(true);
  };

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedRequest(null);
  };

  const tabs = [
    { label: "همه درخواست‌ها", value: "all" },
    { label: "در انتظار", value: "pending" },
    { label: "پذیرفته شده", value: "accepted" },
    { label: "رد شده", value: "rejected" },
    { label: "منقضی شده", value: "expired" }
  ];

  return (
    <div className="mentee-check-requests-container">
      <h2>مدیریت درخواست‌ها</h2>

      <div className="mentee-check-requests-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            className={`mentee-tab-button ${activeTab === tab.value ? "active" : ""}`}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p>در حال بارگذاری...</p>
      ) : error ? (
        <p className="mentee-check-requests-error-message">{error}</p>
      ) : (
        <table className="mentee-check-requests-table">
          <thead>
            <tr>
              <th>منتور</th>
              <th>عنوان</th>
              <th>مبلغ</th>
              <th>وضعیت</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.request_id}>
                <td>
                  {request.mentor_info.name} {request.mentor_info.family_name}
                </td>
                <td>{request.plan_info ? request.plan_info.title : request.session_info?.title}</td>
                <td>{request.amount} تومان</td>
                <td>{request.status}</td>
                <td>
                  <button onClick={() => handleViewDetails(request)}>جزئیات</button>
                  {request.status === "pending" && (
                    <button onClick={() => handleCancelRequest(request.request_id)} className="mentee-cancel-button">
                      لغو
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showDetails && selectedRequest && (
        <div className="mentee-request-details-popup-overlay">
          <div className="mentee-request-details-popup">
            <span className="close-button" onClick={closeDetails}>
              &times;
            </span>
            <h3>جزئیات درخواست</h3>
            <div className="mentee-request-details-content">
              <img
                src={`${config.path}/static/${selectedRequest.mentor_info.profile_image}`}
                alt="Mentor Profile"
                className="mentee-details-mentor-image"
              />
              <p><strong>نام منتور:</strong> {selectedRequest.mentor_info.name} {selectedRequest.mentor_info.family_name}</p>
              <p><strong>عنوان:</strong> {selectedRequest.plan_info ? selectedRequest.plan_info.title : selectedRequest.session_info?.title}</p>
              <p><strong>مبلغ:</strong> {selectedRequest.amount} تومان</p>
              <p><strong>توضیحات:</strong> {selectedRequest.plan_info ? selectedRequest.plan_info.description : selectedRequest.session_info?.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenteeCheckRequests;
