import React, { useState } from 'react';
import "./Nameprofile.css";
import { MdMapsHomeWork, MdBusiness, MdLocationOn } from "react-icons/md";
import { FaUniversity } from "react-icons/fa";
import { MdOutlineRotate90DegreesCw } from "react-icons/md";
import { SiKnowledgebase } from "react-icons/si";
import defaultProfileImage from "../../../../assets/images/empty_profile.webp";
import config from '../../../../config';
import axios from 'axios';

function NameProfile({ mentor_id, name, job, compony, about, city, degree, university, degree_title, profileImage }) {
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState(null);

  const saveMentor = async () => {
    try {
      const response = await axios.post(`${config.path}/save_mentor/${mentor_id}`, {}, {
        withCredentials: true, 
      });
      if (response.status === 200) {
        setIsSaved(true); 
      }
    } catch (err) {
      setError('Error saving mentor. Please try again.');
    }
  };

  return (
    <div className='n-p-container'>
      <div className='n-p-background-container'></div>
      <div className='n-p-information-container'>
        <button 
            className='n-p-information-save-button n-p-stars-con' 
            onClick={saveMentor}
            disabled={isSaved} 
        >
            {isSaved ? "منتور ذخیره شد" : "ذخیره منتور"}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>} 

        <div className="n-p-information-image-container">
          <img 
            src={profileImage ? `${config.path}/${profileImage}` : defaultProfileImage} 
            alt="profile_image" 
            className='n-p-information-image' 
          />
        </div>

        <div className='n-p-information-name'>{name}</div>

        <div className='n-p-location-about'>
          <div className='n-p-information-location'>
            <MdLocationOn className="location-icon" /> {city}
          </div>
          <div className='n-p-information-about'>{about}</div>
        </div>

        <div className="n-p-information-separator"></div> 

        <div className='info-degree-profile-mentor-container'>
          <div className='info-mentor-profile-container'>
            <div>
              <span className='n-p-information-exp-orange n-p-information-exp-texts'>
                <MdBusiness className="company-icon" /> {compony}
              </span>
            </div>

            <div className='n-p-information-exp'>
              <span className='n-p-information-exp-gray n-p-information-exp-texts'>
                <MdMapsHomeWork className="job-icon" /> {job}
              </span>
            </div>
          </div>

          <div className='degree-mentor-profile-container'>
            <div className='n-p-information-exp'>
              <span className='n-p-information-exp-gray n-p-information-exp-texts'>
                <SiKnowledgebase className="job-icon" /> {degree_title}
              </span>
            </div>

            <div className='n-p-information-exp'>
              <span className='n-p-information-exp-gray n-p-information-exp-texts'>
                <FaUniversity className="job-icon" /> {university}
              </span>
            </div>

            <div className='n-p-information-exp'>
              <span className='n-p-information-exp-gray n-p-information-exp-texts'>
                <MdOutlineRotate90DegreesCw className="job-icon" /> {degree}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NameProfile;
