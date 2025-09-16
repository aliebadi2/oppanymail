import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MentorManageRequests.css";
import config from "../../../../../config";

const MentorManageRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showRequestDetails, setShowRequestDetails] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [activeTab, setActiveTab] = useState("all"); 

  useEffect(() => {
    fetchRequests(activeTab);
  }, [activeTab]);

  const fetchRequests = async (tab) => {
    setLoading(true);
    setError("");
    try {
      const endpoint = `${config.path}/mentor/requests${tab !== "all" ? `/${tab}` : ""}`;
      const response = await axios.get(endpoint, { withCredentials: true });
      setRequests(response.data);
    } catch (err) {
      setError("مشکلی در بارگذاری درخواست‌ها وجود دارد.");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      await axios.post(`${config.path}/mentor/requests/${requestId}/accept`, {}, {
        withCredentials: true,
      });
      fetchRequests(activeTab);
      setShowRequestDetails(false);
    } catch (err) {
      setError("خطا در پذیرش درخواست.");
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await axios.post(`${config.path}/mentor/requests/${requestId}/reject`, {}, {
        withCredentials: true,
      });
      fetchRequests(activeTab);
      setShowRequestDetails(false);
    } catch (err) {
      setError("خطا در رد درخواست.");
    }
  };

  const openRequestDetails = (request) => {
    setSelectedRequest(request);
    setShowRequestDetails(true);
  };

  const closeRequestDetails = () => {
    setShowRequestDetails(false);
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
    <div className="mentor-manage-requests-container">
      <h2>مدیریت درخواست‌ها</h2>

      <div className="mentor-manage-requests-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            className={`mentor-tab-button ${activeTab === tab.value ? "active" : ""}`}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="loading-message">در حال بارگذاری...</p>
      ) : error ? (
        <p className="mentor-manage-requests-error-message">{error}</p>
      ) : (
        <table className="mentor-manage-requests-table">
          <thead>
            <tr>
              <th>نام منتی</th>
              <th>عنوان</th>
              <th>مبلغ</th>
              <th>وضعیت</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.request_id} className="fade-in">
                <td>{request.mentee_info.name} {request.mentee_info.family_name}</td>
                <td>{request.plan_info ? request.plan_info.title : request.session_info?.title}</td>
                <td>{request.amount} تومان</td>
                <td>{request.status === "pending" ? "در انتظار" : request.status}</td>
                <td>
                  <button onClick={() => openRequestDetails(request)} className="details-button">جزئیات</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showRequestDetails && selectedRequest && (
        <div className="mentor-request-details-modal">
          <div className="mentor-request-details-content">
            <span className="close-button" onClick={closeRequestDetails}>
              &times;
            </span>
            <h3>جزئیات درخواست</h3>
            <img
              src={`${config.path}/${selectedRequest.mentee_info.profile_image}`}
              alt="Mentee Profile"
              className="mentee-profile-image"
            />
            <p><strong>نام منتی:</strong> {selectedRequest.mentee_info.name} {selectedRequest.mentee_info.family_name}</p>
            <p><strong>عنوان:</strong> {selectedRequest.plan_info ? selectedRequest.plan_info.title : selectedRequest.session_info?.title}</p>
            <p><strong>مبلغ:</strong> {selectedRequest.amount} تومان</p>
            <p><strong>توضیحات:</strong> {selectedRequest.plan_info ? selectedRequest.plan_info.description : selectedRequest.session_info?.description}</p>

            <div className="mentor-request-actions">
              <button onClick={() => handleAcceptRequest(selectedRequest.request_id)} className="accept-button">پذیرش</button>
              <button onClick={() => handleRejectRequest(selectedRequest.request_id)} className="reject-button">رد</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorManageRequests;
