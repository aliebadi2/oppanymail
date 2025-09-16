import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MentorCard.css';
import emptyProfileImage from '../../../assets/images/empty_profile.webp';
import { FaCity, FaUniversity } from 'react-icons/fa';
import { MdWorkOutline } from "react-icons/md";
import { CiLocationOn } from "react-icons/ci";
import { HiAcademicCap } from "react-icons/hi2";
import StarRating from '../StarRating/StarRating';
import axios from 'axios';
import config from '../../../config';

/**
 * @param {Object} props
 * @param {Object} props.mentorData - Data for the mentor
 * @param {boolean} props.isSuggest  - If true, apply 1rem margins on left/right; otherwise no margins
 */
function MentorCard({ mentorData, isSuggest }) {
  const { user_id, username, user_info } = mentorData;
  const { name, family_name, job, company, skills_names, degree, university, city } = user_info || {};

  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(emptyProfileImage);
  const [averageScore, setAverageScore] = useState(2.5);

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await axios.get(`${config.path}/profile_image/${user_id}`);
        if (response.status === 200 && response.data.image_url) {
          setProfileImage(response.data.image_url);
        }
      } catch (err) {
        setProfileImage(emptyProfileImage);
      }
    };

    const fetchAverageScore = async () => {
      try {
        const response = await axios.get(`${config.path}/mentor/${user_id}/average_score`);
        if (response.status === 200 && response.data.average_score !== undefined) {
          setAverageScore(response.data.average_score);
        }
      } catch (err) {
        setAverageScore(2.5);
      }
    };

    if (user_id) {
      fetchProfileImage();
      fetchAverageScore();
    }
  }, [user_id]);

  const handleCardClick = () => {
    navigate(`/mentor/profile/${username}`);
  };

  /**
   * We add either "suggest-margin" or "no-margin" depending on the `isSuggest` prop.
   */
  const marginClass = isSuggest ? 'suggest-margin' : 'no-margin';

  return (
    <div
      className={`mentor-card ${marginClass}`}
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="mentor-card-inner">
        <div className="mentor-card-image-stars-container">
          <div className="mentor-card-image-container">
            <img
              src={profileImage}
              alt={`${name} ${family_name}'s profile`}
              className="mentor-card-image"
              onError={(e) => {
                e.target.src = emptyProfileImage;
              }}
            />
          </div>
          <StarRating rating={averageScore} />
        </div>

        <div className="mentor-card-details">
          <div className="mentor-card-item-city-name-container">
            <h2>{`${name} ${family_name}`}</h2>
            <div className="mentor-card-item-container">
              <CiLocationOn />
              {city || "شهر ناشناخته"}
            </div>
          </div>

          <div className="mentor-card-main-container">
            <div className="mentor-card-comp-container">
              <div className="mentor-card-item-container">
                <MdWorkOutline />
                <p className="mentor-card-job-title">{job || "شغل ناشناخته"}</p>
              </div>
              <div className="mentor-card-item-container">
                <FaCity />
                <p className="mentor-card-job-title">{company || "شرکت ناشناخته"}</p>
              </div>
            </div>

            <div className="mentor-card-comp-container">
              <div className="mentor-card-item-container">
                <HiAcademicCap />
                {degree || "مدرک نامشخص"}
              </div>
            </div>
            <div className="mentor-card-comp-container">
              <div className="mentor-card-item-container">
                <FaUniversity />
                {university || "دانشگاه نامشخص"}
              </div>
            </div>
          </div>
        </div>

        <div className="mentor-card-skills">
          {skills_names && skills_names.length > 0 ? (
            skills_names.map((skill, index) => (
              <span key={index} className="mentor-card-skill">
                {skill}
              </span>
            ))
          ) : (
            <span className="mentor-card-skill">مهارت‌ها موجود نیستند</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default MentorCard;
