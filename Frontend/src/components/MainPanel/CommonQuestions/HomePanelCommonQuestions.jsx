import React, { useEffect, useState } from 'react';
import QuestionComponent from '../../AllCommonQuestion/QuestionComponent/QuestionComponent';
import './HomePanelCommonQuestions.css';
import axios from 'axios';
import config from '../../../config';

function HomePanelCommonQuestions() {
  const [questionList, setQuestionList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`${config.path}/common-questions/main_page`)
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
    <div className='question-section-container'>
      <h1 className='question-section-title'>سوالات متداول</h1>
      {questionList.map((question) => (
        <QuestionComponent key={question.id} title={question.question} text={question.answer} />
      ))}
    </div>
  );
}

export default HomePanelCommonQuestions;
