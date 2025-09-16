import React, { useState, useEffect } from 'react';
import './MentorCommentContainer.css';
import MentorComment from '../mentorComment/MentorComment';
import axios from 'axios';
import config from '../../../../config';

function MentorCommentContainer({ mentorId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`${config.path}/comments/mentor/${mentorId}`);
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching mentor comments:', error);
      }
    };

    if (mentorId) {
      fetchComments();
    }
  }, [mentorId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      alert('لطفا یک امتیاز انتخاب کنید.');
      return;
    }

    try {
      await axios.post(
        `${config.path}/comments`,
        { text: newComment, score: rating, mentor_id: mentorId },
        { withCredentials: true }
      );

      setNewComment('');
      setRating(0);
      setShowSuccessMessage(true);

      const response = await axios.get(`${config.path}/comments/mentor/${mentorId}`);
      setComments(response.data);

      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('خطا در ثبت نظر. لطفاً دوباره تلاش کنید.');
    }
  };

  return (
    <div className='mentor-comment-container'>
      <div className='mentor-comment-title-container'>نظرات منتی درباره منتور</div>
      <div className='mentor-comment-comment-container'>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <MentorComment
              key={comment.id}
              img={`${config.path}/${comment.mentee_profile_image}`}  // Corrected image endpoint
              name={`${comment.mentee_name} ${comment.mentee_family_name}`}
              stars={comment.score}
              date={comment.date_created}
              explain={comment.text}
            />
          ))
        ) : (
          <div className='no-comment-mentor-profile'>هیچ نظری برای این منتور ثبت نشده است.</div>
        )}
      </div>

      <div className='add-comment-section'>
        <h3>نظر خود را درمورد منتور ثبت کنید...</h3>
        <form onSubmit={handleCommentSubmit}>
          <div className='star-rating'>
            {[...Array(5)].map((_, index) => (
              <span
                key={index}
                className={index + 1 <= (hover || rating) ? 'on' : 'off'}
                onClick={() => setRating(index + 1)}
                onMouseEnter={() => setHover(index + 1)}
                onMouseLeave={() => setHover(0)}
              >
                &#9733;
              </span>
            ))}
          </div>
          <textarea
            placeholder='نظر خود را با بقیه به اشتراک بگذارید ...'
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            required
          />
          <button type='submit'>ثبت نظر</button>
        </form>
        {showSuccessMessage && <div className='success-message'>نظر شما با موفقیت ثبت شد!</div>}
      </div>
    </div>
  );
}

export default MentorCommentContainer;
