import React, { useEffect, useState } from "react";
import "./MentorSuggest.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import axios from "axios";
import MentorCard from "../MentorCard/MentorCard";
import config from "../../../config";

function MentorSuggest() {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const response = await axios.get(`${config.path}/show-mentors/random`);
        setMentors(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load mentors");
        setLoading(false);
      }
    };

    fetchMentors();
  }, []);

  const settings = {
    dots: false,
    infinite: mentors.length > 1,  // Disable infinite scroll if only one mentor
    speed: 500,
    slidesToScroll: 1,
    rtl: true,
    variableWidth: mentors.length > 1,  // Enable variable width only if there are multiple mentors
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          variableWidth: mentors.length > 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          variableWidth: mentors.length > 1,
        },
      },
    ],
  };

  if (loading) {
    return <div>Loading mentors...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (mentors.length === 0) {
    return <div>No mentors available.</div>;
  }

  return (
    <div className="mentor-suggest-slider-container">
      <p className="mentor-suggest-slider-text">منتور های پیشنهادی برای شما :</p>
      <Slider {...settings} className="mentor-suggest-slider">
        {mentors.map((mentor) => (
          <div key={mentor.user_id}>
            <MentorCard 
              mentorData={mentor} 
              isSuggest={true}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default MentorSuggest;
