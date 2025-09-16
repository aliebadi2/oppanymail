import React from 'react';
import { useNavigate } from "react-router-dom";
import { FaRegCheckCircle } from 'react-icons/fa';

function Step5({ errorMessages, setStep }) {
  const navigate = useNavigate();
  return (
      <div className="login-page-input-buttons">
            <div className="step-bar">
            <FaRegCheckCircle color="#4D7C0F" size={"1.5rem"} />
            <div className="step-line green-bg"></div>
            <FaRegCheckCircle color="#4D7C0F" size={"1.5rem"} />
            <div className="step-line green-bg"></div>
            <FaRegCheckCircle color="#4D7C0F" size={"1.5rem"} />
            <div className="step-line green-bg"></div>
            <FaRegCheckCircle color="#4D7C0F" size={"1.5rem"} />
            </div>

            <div className="signup-waiting-text">
                  {errorMessages.form ? (
                  <p className="error">{errorMessages.form}</p>
                  ) : (
                  <p>ثبت نام با موفقیت انجام شد، لطفا ایمیل خود را تایید کنید!</p>
                  )}
            </div>

            <div className="signup-page-buttons">
                  <button className="primary-button signup-big-button" onClick={() => navigate("/")}>
                  صفحه‌ی اصلی
                  </button>
            </div>
      </div>
  );
}

export default Step5;
