import React, { useState, useEffect } from 'react';
import './WelcomeHeader.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import config from '../../../config';

function WelcomeHeader() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: '',
    familyName: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleNavigate = () => {
    navigate('/all_mentors'); 
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`${config.path}/welcome`, {
          withCredentials: true,
        });

        const { name, family_name } = response.data;
        setUserData({
          name: name || '',
          familyName: family_name || '',
        });
        setLoading(false);
      } catch (error) {
        setError('Error fetching user info.');
        setLoading(false);
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, []);

  if (loading) {
    return <div>Loading user information...</div>;
  }

  return (
    <div className='welcome-section'>
      <div className='welcome-section-upper'>
        <div className='welcome-container-upper-inner-section'>
          <div className='welcome-section-name-welcome'>
            <div className='welcome-container-upper-name'>
              {userData.name && userData.familyName
                ? `${userData.name} ${userData.familyName}`
                : 'Loading...'}
            </div>
            <div className='welcome-container-upper-text'>خوش آمدید</div>
          </div>
          <p className='welcome-container-middle-container'>
            شروع به ارتباط با مربیان کنید و آماده شوید تا حرفه خود را به سطح بعدی ببرید!
          </p>
          <button className='welcome-search-button-container' onClick={handleNavigate}>
            به دنبال منتور بگردید
          </button>
        </div>
      </div>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default WelcomeHeader;
