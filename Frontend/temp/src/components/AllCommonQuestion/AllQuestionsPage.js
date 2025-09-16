import React, { useEffect, useState } from 'react';
import axios from 'axios';
import QuestionComponent from './QuestionComponent/QuestionComponent'; 
import './AllQuestionsPage.css';
import config from '../../config';
function AllQuestionsPage() {
  const [questionList, setQuestionList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`${config.path}/common-questions/`)
      .then((response) => {
        setQuestionList(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching questions:', err);
        setError('Failed to load questions');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading questions...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="all-questions-page">
      <h1 className="all-questions-title">سوالات متداول</h1>
      <div className="all-questions-container">
        {questionList.map((question) => (
          <QuestionComponent 
            key={question.id} 
            title={question.question} 
            text={question.answer} 
          />
        ))}
      </div>
    </div>
  );
}

export default AllQuestionsPage;
