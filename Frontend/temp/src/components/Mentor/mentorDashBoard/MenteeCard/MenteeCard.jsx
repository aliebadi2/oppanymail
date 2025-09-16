import React, { useState } from 'react';
import './MenteeCard.css';
import fallbackProfileImage from '../../../../assets/images/empty_profile.webp'; 
import MenteeInfo from './MenteeInfo'; // Import the MenteeInfo component

const MenteeCard = ({ name, menteeId, courseType, infoLink, onAccept, onReject, profileImage }) => {
  const [showMenteeInfo, setShowMenteeInfo] = useState(false); // Manage showing mentee info

  const handleImageError = (e) => {
    e.target.src = fallbackProfileImage;
  };

  const toggleMenteeInfo = () => {
    setShowMenteeInfo(!showMenteeInfo);
  };

  return (
    <div className='mentee-card'>
      <div className='mentee-card-info-img'>
        <div className='mentee-card-image-container'>
          <img className='mentee-card-image'
            src={profileImage}
            alt={`${name}'s profile`}
            onError={handleImageError} // If image fails to load, use fallback
          />
        </div>
        <div className="mentee-card-info">
          <p>{name}</p>
          <p>{courseType === 'basic' ? 'دوره مقدماتی' : 'دوره پیشرفته'}</p> {/* Show course type */}
          <button className='mentee-card-see-information' onClick={toggleMenteeInfo}>مشاهده اطلاعات</button> {/* Toggle to show mentee info */}
        </div>
      </div>
      <div className='mentee-card-buttonss'>
        <button className='mentee-card-button-accept' onClick={onAccept}>
          پذیرش درخواست
        </button>
        <button className='mentee-card-button-reject' onClick={onReject}>
          رد درخواست
        </button>
      </div>

      {/* Show MenteeInfo component when button is clicked */}
      {showMenteeInfo && <MenteeInfo menteeId={menteeId} onClose={toggleMenteeInfo} />}
    </div>
  );
};

export default MenteeCard;
