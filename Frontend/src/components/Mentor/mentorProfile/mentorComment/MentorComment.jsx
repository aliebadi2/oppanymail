import React from 'react';
import './MentorComment.css';
import defaultProfileImage from '../../../../assets/images/empty_profile.webp';

function MentorComment({ img, name, stars, date, explain }) {
  const starElements = Array(5)
    .fill()
    .map((_, i) => (
      <span key={i} className={i < stars ? 'filled-star' : 'empty-star'}>
        &#9733;
      </span>
    ));

  return (
    <div className='mentor-comment-containers'>
      <div className='mentor-comment-inner-container'>
        <div className='mentor-comment-upper-container'>
          <div className='mentor-comment-upper-profile-container'>
            <img
              src={img}
              alt='Profile'
              className='mentor-comment-upper-container'
              onError={(e) => (e.target.src = defaultProfileImage)}  // Fallback to default profile image
            />
          </div>
          <div className='mentor-comment-upper-name-container'>
            <div className='mentor-comment-upper-name'>{name}</div>
            <div className='mentor-comment-upper-stars'>
              <div className='mentor-comment-upper-stars-style'>{starElements}</div>
              <div className='mentor-comment-upper-date'>{date}</div>
            </div>
          </div>
        </div>
        <div className='mentor-comment-bottom-container'>{explain}</div>
      </div>
    </div>
  );
}

export default MentorComment;
