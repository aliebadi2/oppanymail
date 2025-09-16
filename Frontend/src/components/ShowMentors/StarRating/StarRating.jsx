import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import "./StarRating.css"

const StarRating = ({ rating }) => {
  // This function returns the stars based on the rating value.
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} color="#FF7900"  />); // Fully filled star
      } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
        stars.push(<FaStarHalfAlt key={i} color="#FF7900" />); // Half-filled star
      } else {
        stars.push(<FaRegStar key={i} color="#FF7900" />); // Empty star
      }
    }
    return stars;
  };

  return (
    <div className='star-rating-component'>
      {renderStars()} {/* This renders the stars */}
    </div>
  );
};

export default StarRating;
