import React, { useEffect, useState } from 'react';
import './MenteeInfo.css'; // CSS for styling
import axios from 'axios';
import { IoMdCloseCircleOutline } from "react-icons/io";
import config from '../../../../config';


const MenteeInfo = ({ menteeId, onClose }) => {
  const [menteeInfo, setMenteeInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenteeInfo = async () => {
      try {
        const response = await axios.get(`${config.path}/show_mentees/mentee_info/${menteeId}`, {
          withCredentials: true,  // Assuming JWT is required
        });
        setMenteeInfo(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load mentee info');
        setLoading(false);
      }
    };

    fetchMenteeInfo();
  }, [menteeId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className={`mentee-info-modal ${menteeInfo ? 'open' : ''}`}>
      <div className="mentee-info-content">
        {/* Close Button */}
        <button onClick={onClose} className="mentee-info-close"><IoMdCloseCircleOutline />
</button>
        <div className='mentee-info-upper-container'>
            <h2>اطلاعات منتی</h2>
            <p><strong>نام : </strong> {menteeInfo.name} {menteeInfo.family_name}</p>
            <p><strong>ایمیل : </strong> {menteeInfo.email}</p>
            <p><strong>شهر : </strong> {menteeInfo.city}</p>
            <p><strong>آدرس : </strong> {menteeInfo.address}</p>
            <p><strong>شماره تماس : </strong> {menteeInfo.phone}</p>
            <p><strong>مدرک‌ : </strong> {menteeInfo.degree || 'N/A'}</p>
            <p><strong>زمینه کاری : </strong> {menteeInfo.work || 'N/A'}</p>
            <p><strong>مهارت ها : </strong> {menteeInfo.skill || 'N/A'}</p>
            <p><strong>درباره من : </strong> {menteeInfo.about || 'N/A'}</p>
        </div>
        <div className='mentee-info-profile-container'>
                  <img 
                  src={`${config.path}/profile_image/mentee/${menteeId}`} 
                  alt="Profile" 
                  className="mentee-profile-img" 
                  />
        </div>
        
      </div>
    </div>
  );
};

export default MenteeInfo;
