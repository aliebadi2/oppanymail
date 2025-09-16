import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./MentorPlans.css";
import config from "../../../../../config";

const MentorDashboardPlans = () => {
  const [activeTab, setActiveTab] = useState("allPlans");
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    fetchPlans(activeTab);
  }, [activeTab]);

  const fetchPlans = async (tab) => {
    setLoading(true);
    setError("");
    try {
      const endpoint =
        tab === "allPlans"
          ? `${config.path}/mentor/all_plans`
          : `${config.path}/mentor/active_plans`;
      const response = await axios.get(endpoint, { withCredentials: true });
      setPlans(response.data);
    } catch (err) {
      setError("مشکلی در بارگذاری برنامه‌ها وجود دارد.");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleViewDetails = (activePlanId) => {
    navigate(`/mentor/courses/${activePlanId}`); // Navigate to the course page
  };

  return (
    <div className="mentor-dashboard-plan-container">
      <h2>برنامه‌های من</h2>
      <div className="mentor-dashboard-plan-toggle">
        <button
          className={activeTab === "allPlans" ? "active" : ""}
          onClick={() => handleTabChange("allPlans")}
        >
          همه برنامه‌ها
        </button>
        <button
          className={activeTab === "activePlans" ? "active" : ""}
          onClick={() => handleTabChange("activePlans")}
        >
          برنامه‌های فعال
        </button>
      </div>

      {loading ? (
        <p>در حال بارگذاری...</p>
      ) : error ? (
        <p className="mentor-dashboard-plan-error-message">{error}</p>
      ) : (
        <div className="mentor-dashboard-plan-table-container">
          <table className="mentor-dashboard-plan-responsive-table">
            <thead>
              <tr>
                <th>عنوان</th>
                <th>شناسه منتی</th>
                <th>نام منتی</th>
                <th>تاریخ شروع</th>
                <th>تاریخ پایان</th>
                <th>وضعیت</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => (
                <tr key={plan.id}>
                  <td>{plan.plan_id}</td>
                  <td>{plan.mentee_id}</td>
                  <td>{plan.mentor_name} {plan.mentor_family_name}</td>
                  <td>
                    {plan.start_date
                      ? new Date(plan.start_date).toLocaleDateString()
                      : "نامشخص"}
                  </td>
                  <td>
                    {plan.end_date
                      ? new Date(plan.end_date).toLocaleDateString()
                      : "نامحدود"}
                  </td>
                  <td>{plan.status}</td>
                  <td>
                    <button onClick={() => handleViewDetails(plan.id)}>
                      مشاهده
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

export default MentorDashboardPlans;
