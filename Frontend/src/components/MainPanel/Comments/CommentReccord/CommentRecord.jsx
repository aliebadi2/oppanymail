import React from 'react';
import './CommentRecord.css';

function CommentRecord({ imgSrc, name, mentor, commentText, date, stars }) {
  const starElements = [...Array(5)].map((_, index) => (
    <span key={index} className={index < stars ? 'filled-star' : 'empty-star'}>
      &#9733;
    </span>
  ));

  return (
    <div className='cr-section'>
      <div className='cr-upper-container'>
        <div className='cr-upper-image-container'>
          <img src={imgSrc} alt={`${name} profile`} className='cr-upper-image' />
        </div>
        <div className='cr-upper-name-container'>
          <div className='cr-upper-name'>{name}</div>
          <div className='cr-upper-mentor'>
            در رابطه با <span className='mentor-name'>{mentor}</span>
          </div>
        </div>
      </div>
      <div className='cr-bottom-container'>
        <p className='cr-comment-text'>{commentText}</p>
        <div className='cd-date-time-container'>
          <div className='cr-stars-container'>{starElements}</div>
          <div className='cr-date'>تاریخ: {date}</div>
        </div>
      </div>
    </div>
  );
}

export default CommentRecord;
