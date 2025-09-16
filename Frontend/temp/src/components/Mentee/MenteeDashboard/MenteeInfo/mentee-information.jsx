import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "../../../Components/Button/Button";
import './mentee-information.css';
import MenteeChangePassword from "./MenteechangePassword/MenteeChangePassword";
import InputLabel from "../../../Mentor/mentorDashBoard/InputLabel/InputLabel";
import config from "../../../../config";

function MenteeInformation() {
  const [menteeData, setMenteeData] = useState({
    name: "",
    family_name: "",
    email: "",
    phone_number: "",
    city: "",
    country: "",
    bio: "",
    skills: [],
  });

  const [initialData, setInitialData] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const toggleChangePasswordPopup = () => {
    setIsChangePasswordOpen(!isChangePasswordOpen);
  };

  // Fetch mentee info on component mount
  useEffect(() => {
    const fetchMenteeInfo = async () => {
      try {
        const response = await axios.get(`${config.path}/mentee/info`, {
          withCredentials: true,
        });

        setMenteeData(response.data);
        setInitialData(response.data); // Store initial data for change detection
      } catch (error) {
        setError("مشکلی در بارگذاری اطلاعات وجود دارد.");
        console.error("Error fetching mentee info:", error);
      }
    };

    fetchMenteeInfo();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setMenteeData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
    setError("");
    setSuccess("");
  };

  const hasChanges = () => {
    if (!initialData) return false;
    return Object.keys(menteeData).some(
      (key) => menteeData[key] !== initialData[key]
    );
  };

  const handleSubmit = async () => {
    if (!hasChanges()) {
      setError("تغییری برای اعمال وجود ندارد");
      return;
    }

    try {
      await axios.put(`${config.path}/mentee/info`, menteeData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      setSuccess("تغییرات با موفقیت ذخیره شدند!");
      setInitialData(menteeData); // Update initial data after successful save
    } catch (error) {
      setError("خطا در ذخیره تغییرات.");
      console.error("Error updating mentee info:", error);
    }
  };

  return (
    <div className="menteeinfo-page">
      <h2>اطلاعات کاربری</h2>
      <div className="menteeinfo-inner-container">
        <InputLabel
          label={"نام"}
          type={"text"}
          id={"name"}
          value={menteeData.name}
          onChange={handleChange}
        />
        <InputLabel
          label={"نام خانوادگی"}
          type={"text"}
          id={"family_name"}
          value={menteeData.family_name}
          onChange={handleChange}
        />
        <InputLabel
          label={"ایمیل"}
          type={"email"}
          id={"email"}
          value={menteeData.email}
          disabled
        />
        <InputLabel
          label={"شهر"}
          type={"text"}
          id={"city"}
          value={menteeData.city}
          onChange={handleChange}
        />
        <InputLabel
          label={"کشور"}
          type={"text"}
          id={"country"}
          value={menteeData.country}
          onChange={handleChange}
        />
        <InputLabel
          label={"شماره تلفن"}
          type={"text"}
          id={"phone_number"}
          value={menteeData.phone_number}
          onChange={handleChange}
        />
        <div className="menteeinfo-goal-container">
          <div className="menteeinfo-goal-label">درباره</div>
          <textarea
            className="menteeinfo-goal-input"
            id="bio"
            placeholder="درباره خود را وارد کنید"
            value={menteeData.bio}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="menteeinfo-goal-button-container">
        <Button 
          text="تغییر رمز"
          buttonstyle="change-password-button"
          onClick={toggleChangePasswordPopup}
        />
        <Button
          text="ذخیره"
          onClick={handleSubmit}
          buttonstyle="primary-button"
        />
      </div>
      {isChangePasswordOpen && (
        <div className='mentorinfo-popup-overlay'>
          <div className='mentorinfo-popup-content'>
            <button className="mentorinfo-close-popup-button" onClick={toggleChangePasswordPopup}>
                ×
            </button>
            <MenteeChangePassword/>
          </div>
        </div>
      )}
      {error && <p className="change-password-error-message">{error}</p>}
      {success && <div className="success-message">{success}</div>}
    </div>
  );
}

export default MenteeInformation;
