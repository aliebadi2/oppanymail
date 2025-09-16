import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './LoadingScreen.css';
import logo from "../../../assets/LOGO.png";
import config from "../../../config";

const LoadingScreen = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const role = query.get('role');  // Get 'role' from query parameters
  const token = query.get('token');  // Get 'token' from query parameters

  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(`${config.path}/signup/activate/${token}`);
        if (response.status === 200) {
          const userRole = response.data.role;
          if (userRole === 'mentee') {
            setStatusMessage("ایمیل شما با موفقیت ثبت شد. از تجربه ی خود به عنوان یک حرفه ای لذت ببرید.");
          } else if (userRole === 'mentor') {
            setStatusMessage("ایمیل شما تایید شد. حساب شما در حال بررسی توسط مدیر است.");
          }
        }
      } catch (error) {
        console.error("Verification error:", error);
        setStatusMessage("خطایی رخ داده است. لطفا مجدداً تلاش کنید یا با پشتیبانی تماس بگیرید.");
      } finally {
        setLoading(false);
      }
    };

    if (token) verifyEmail();
  }, [role, token]);

  return (
    <div className="loading-container">
      <div className="loading-logo-container">
        <img src={logo} alt="Logo" className="loading-logo" />
        {loading && <div className="spinner"></div>}
      </div>
      <div className="loading-text-container">
        {loading ? (
          <p className='loading-text'>Loading... Please wait</p>
        ) : (
          <p className='loading-text'>{statusMessage}</p>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;
