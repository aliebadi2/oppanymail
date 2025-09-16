import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MentorPriceCard.css";
import callIcon from "../../../../assets/phone_enabled_24dp_3A8EEF_FILL0_wght400_GRAD0_opsz24.svg";
import timerIcon from "../../../../assets/timer_24dp_3A8EEF_FILL0_wght400_GRAD0_opsz24.svg";
import config from "../../../../config";

const MentorPriceCard = ({ mentorId }) => {
  const [data, setData] = useState({ plans: [], sessions: [] });
  const [selectedCategory, setSelectedCategory] = useState("plans");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const charLimit = 70;

  const transformData = (resData) => {
    return {
      plans: resData.plans.map((p) => ({
        ...p,
        response_time: p.max_response_time,
        session_number: p.number_of_sessions,
      })),
      sessions: resData.sessions.map((s) => ({
        ...s,
        response_time: 0,
        session_time: s.session_time || 0,
        session_number: 0,
      })),
    };
  };

  useEffect(() => {
    axios
      .get(`${config.path}/mentor_card/${mentorId}`)
      .then((res) => {
        const transformed = transformData(res.data);
        setData(transformed);
        setSelectedItem(transformed.plans[0] || null);
      })
      .catch(() => {});
  }, [mentorId]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setIsExpanded(false);
    setSelectedItem(data[category][0] || null);
  };

  const handleRequestSubmit = async () => {
    if (!selectedItem) {
      setError("لطفاً یک پلن یا جلسه را انتخاب کنید.");
      return;
    }

    try {
      const response = await axios.post(
        `${config.path}/mentee/requests`,
        {
          plan_or_session_id: selectedItem.id,
          type: selectedCategory === "plans" ? "plan" : "session",
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setError(null);
        setSuccess("درخواست شما با موفقیت ثبت شد.");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "خطا در ارسال درخواست. لطفاً دوباره تلاش کنید.";
      setError(errorMsg);
    }
  };

  return (
    <div className="mentor-price-card-container">
      <div className="mentor-price-card-session-or-plan">
        <div
          className={`mentor-price-card-plans ${
            selectedCategory === "plans" ? "active-tab" : ""
          }`}
          onClick={() => handleCategoryChange("plans")}
        >
          پلن‌ها
        </div>
        <div
          className={`mentor-price-card-plans ${
            selectedCategory === "sessions" ? "active-tab" : ""
          }`}
          onClick={() => handleCategoryChange("sessions")}
        >
          جلسات
        </div>
      </div>

      <div className="mentor-price-card-plans-list">
        {data[selectedCategory].map((item, index) => (
          <div
            key={index}
            className={`mentor-price-card-plan-item ${
              selectedItem?.title === item.title ? "active" : ""
            }`}
            onClick={() => {
              setSelectedItem(item);
              setIsExpanded(false);
            }}
          >
            {item.title}
          </div>
        ))}
      </div>

      {selectedItem && (
        <div className="mentor-price-card-plan-details">
          <p className="mentor-price-card-price">{selectedItem.price} تومان</p>
          <p className="mentor-price-card-description">
            {isExpanded
              ? selectedItem.description
              : `${selectedItem.description?.substring(0, charLimit) || ""}...`}
            <span
              className="expand-toggle"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "نمایش کمتر" : "نمایش بیشتر"}
            </span>
          </p>
          <div className="mentor-price-card-item-container">
            <img src={timerIcon} alt="Response time" />
            <p>احتمال پاسخگویی در {selectedItem.response_time} ساعت آینده</p>
          </div>
          <div className="mentor-price-card-item-container">
            <img src={callIcon} alt="Call time" />
            <p>
              {selectedItem.session_number} تماس در ماه (تماس /{" "}
              {selectedItem.session_time} دقیقه)
            </p>
          </div>
        </div>
      )}

      <button className="mentor-price-card-submit-button" onClick={handleRequestSubmit}>
        رزرو
      </button>

      {error && <p className="mentor-price-card-error-message">{error}</p>}
      {success && <p className="mentor-price-card-success-message">{success}</p>}
    </div>
  );
};

export default MentorPriceCard;
