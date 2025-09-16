import React, { useState, useEffect } from 'react';
import "./MentorProfile.css";
import { useParams } from 'react-router-dom'; 
import axios from 'axios'; 
import MentorCommentContainer from './MentorCommentContainer/MentorCommentContainer';
import MentorPriceCard from './MentorPriceCard/MentorPriceCard';
import NameProfile from './nameProfile/NameProfile';
import Specs from './specs/Specs';
import StarRating from '../../ShowMentors/StarRating/StarRating';
import config from '../../../config';

function MentorProfile() {
  const { username } = useParams(); 
  const [mentorData, setMentorData] = useState(null); 
  const [averageScore, setAverageScore] = useState(2.5); 

  useEffect(() => {
    const fetchMentorData = async () => {
      try {
        const response = await axios.get(`${config.path}/show-mentors/profile/${username}`);
        const mentor = response.data;
        setMentorData(mentor);

        if (mentor.user_id) {
          const scoreResponse = await axios.get(`${config.path}/mentor/${mentor.user_id}/average_score`);
          if (scoreResponse.status === 200 && scoreResponse.data.average_score !== undefined) {
            setAverageScore(scoreResponse.data.average_score); 
          } else {
            console.warn("Average score not available, using default score of 2.5");
          }

        } else {
          console.error("No user_id found in mentor data");
        }
      } catch (error) {
        console.error("Error fetching mentor data or score:", error);
        setAverageScore(2.5); 
      }
    };

    if (username) {
      fetchMentorData();
    }
  }, [username]);

  return (
    <div className='mentor-profile-page'>
      {mentorData && (
        <>
          <NameProfile
            mentor_id={mentorData.user_id}
            profileImage={mentorData.user_info.profile_image}
            name={`${mentorData.user_info.name} ${mentorData.user_info.family_name}`}
            job={mentorData.user_info.bio || "عنوان شغلی نامشخص"}
            compony={"شرکت نامشخص"} 
            about={mentorData.user_info.bio || "اطلاعات نامشخص"}
            city={mentorData.user_info.city || "شهر نامشخص"}
            degree={mentorData.user_info.degree || "مدرک تحصیلی نامشخص"}
            university={mentorData.user_info.university || "دانشگاه نامشخص"}
            degree_title={mentorData.user_info.phone_number || "رشته نامشخص"} 
          />
          <div className="mentor-card-container">
            <MentorPriceCard mentorId={mentorData.user_id} />
          </div>
          <div className="mentor-profile-score">
            <h3>امتیاز منتور</h3>
            <StarRating rating={averageScore} /> 
          </div>
          {mentorData.user_info.skills_names && (
            <Specs skills={mentorData.user_info.skills_names} />
          )}
          <MentorCommentContainer mentorId={mentorData.user_id} />
        </>
      )}
    </div>
  );
}

export default MentorProfile;
