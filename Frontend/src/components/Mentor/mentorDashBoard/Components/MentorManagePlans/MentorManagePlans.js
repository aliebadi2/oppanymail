import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MentorManagePlans.css";
import config from "../../../../../config";

const MentorManagePlans = () => {
  const [plans, setPlans] = useState([]);
  const [newPlan, setNewPlan] = useState({
    title: "",
    description: "",
    session_time: "",
    number_of_sessions: "",
    max_response_time: "",
    price: "",
  });
  const [editPlanId, setEditPlanId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${config.path}/mentor/plans`, {
        withCredentials: true,
      });
      setPlans(response.data);
    } catch (err) {
      setError("مشکلی در بارگذاری برنامه‌ها وجود دارد.");
    } finally {
      setLoading(false);
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    setEditPlanId(null);
    setNewPlan({
      title: "",
      description: "",
      session_time: "",
      number_of_sessions: "",
      max_response_time: "",
      price: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPlan((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateOrUpdatePlan = async () => {
    try {
      if (editPlanId) {
        await axios.put(`${config.path}/mentor/plans/${editPlanId}`, newPlan, {
          withCredentials: true,
        });
      } else {
        await axios.post(`${config.path}/mentor/plans`, newPlan, {
          withCredentials: true,
        });
      }
      fetchPlans();
      toggleForm();
    } catch (err) {
      setError("خطا در ایجاد یا به‌روزرسانی برنامه.");
    }
  };

  const handleEditPlan = (plan) => {
    setEditPlanId(plan.id);
    setNewPlan({
      title: plan.title,
      description: plan.description,
      session_time: plan.session_time,
      number_of_sessions: plan.number_of_sessions,
      max_response_time: plan.max_response_time,
      price: plan.price,
    });
    setShowForm(true);
  };

  const handleDeletePlan = async (planId) => {
    try {
      await axios.delete(`${config.path}/mentor/plans/${planId}`, {
        withCredentials: true,
      });
      fetchPlans();
    } catch (err) {
      setError("خطا در حذف برنامه.");
    }
  };

  return (
    <div className="mentor-manage-plans-container">
      <h2>مدیریت برنامه‌ها</h2>
      <button className="mentor-manage-plans-add-button" onClick={toggleForm}>
        {showForm ? "بستن" : "+ افزودن برنامه"}
      </button>

      {loading ? (
        <p>در حال بارگذاری...</p>
      ) : error ? (
        <p className="mentor-manage-plans-error-message">{error}</p>
      ) : (
        <div className="mentor-manage-plans-table-container">
          <table className="mentor-manage-plans-table">
            <thead>
              <tr>
                <th>عنوان</th>
                <th>توضیحات</th>
                <th>زمان جلسه</th>
                <th>تعداد جلسات</th>
                <th>حداکثر زمان پاسخ</th>
                <th>قیمت</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => (
                <tr key={plan.id}>
                  <td>{plan.title}</td>
                  <td>{plan.description}</td>
                  <td>{plan.session_time} دقیقه</td>
                  <td>{plan.number_of_sessions}</td>
                  <td>{plan.max_response_time} ساعت</td>
                  <td>{plan.price} تومان</td>
                  <td>
                    <button onClick={() => handleEditPlan(plan)}>ویرایش</button>
                    <button onClick={() => handleDeletePlan(plan.id)}>حذف</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="mentor-manage-plans-modal">
          <div className="mentor-manage-plans-modal-content">
            <span className="mentor-manage-plans-close" onClick={toggleForm}>
              &times;
            </span>
            <h3>{editPlanId ? "ویرایش برنامه" : "ایجاد برنامه جدید"}</h3>
            <input
              type="text"
              name="title"
              placeholder="عنوان"
              value={newPlan.title}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="description"
              placeholder="توضیحات"
              value={newPlan.description}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="session_time"
              placeholder="زمان جلسه (دقیقه)"
              value={newPlan.session_time}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="number_of_sessions"
              placeholder="تعداد جلسات"
              value={newPlan.number_of_sessions}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="max_response_time"
              placeholder="حداکثر زمان پاسخ (ساعت)"
              value={newPlan.max_response_time}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="price"
              placeholder="قیمت (تومان)"
              value={newPlan.price}
              onChange={handleInputChange}
            />
            <button onClick={handleCreateOrUpdatePlan}>
              {editPlanId ? "به‌روزرسانی" : "ایجاد"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorManagePlans;
