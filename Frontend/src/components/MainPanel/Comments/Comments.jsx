import React, { useEffect, useState } from 'react';
import './Comments.css';
import CommentRecord from './CommentReccord/CommentRecord';
import axios from 'axios';
import config from '../../../config';
import defaultProfileImage from '../../../assets/LOGO.png';  // Import the default image

function Comments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`${config.path}/comments/random`);
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  if (loading) {
    return <div>در حال بارگذاری نظرات...</div>;
  }

  return (
    <div className='comment-section'>
      <h1 className='comment-title'>دیدگاه‌های کاربران</h1>
      <h2 className='comment-explain'>نظرات مشتریان راضی ما درباره تجربه‌شان با منتورها را بخوانید</h2>
      <div className='comment-record-container'>
        {comments.map((comment) => (
          <CommentRecord
            key={comment.id}
            imgSrc={comment.mentee_profile_image 
              ? `${config.path}/${comment.mentee_profile_image}`  // Use correct image path
              : defaultProfileImage}  // Use default image if mentee_profile_image is null
            name={`${comment.mentee_name} ${comment.mentee_family_name}`}
            mentor={`${comment.mentor_name} ${comment.mentor_family_name}`}
            commentText={comment.text}
            date={comment.date_created}
            stars={comment.score}
          />
        ))}
      </div>
    </div>
  );
}

export default Comments;
