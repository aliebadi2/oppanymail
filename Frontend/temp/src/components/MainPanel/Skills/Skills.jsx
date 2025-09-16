import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Skills.css';
import config from '../../../config';

function Skills() {
  const tabsListRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScrollValue, setMaxScrollValue] = useState(0);
  const [skills, setSkills] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchSkills = async () => {
    try {
      const response = await axios.get(`${config.path}/skills`);
      setSkills(response.data);
    } catch (err) {
      setError('Failed to load skills');
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleScroll = () => {
    if (tabsListRef.current) {
      setScrollPosition(tabsListRef.current.scrollLeft);
      setMaxScrollValue(tabsListRef.current.scrollWidth - tabsListRef.current.clientWidth);
    }
  };

  const scrollRight = () => {
    if (tabsListRef.current) {
      tabsListRef.current.scrollLeft += 200;
      handleScroll();
    }
  };

  const scrollLeft = () => {
    if (tabsListRef.current) {
      tabsListRef.current.scrollLeft -= 200;
      handleScroll();
    }
  };

  const handleSkillClick = (skill) => {
    navigate(`/all_mentors/${skill.skill_id}`);
  };

  useEffect(() => {
    const tabsList = tabsListRef.current;
    if (tabsList) {
      tabsList.addEventListener('scroll', handleScroll);
      handleScroll();
      return () => {
        tabsList.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="scrollable-tabs-container">
      <div className={`right-arrow ${scrollPosition > 20 ? 'active' : ''}`} onClick={scrollRight}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </div>
      <ul ref={tabsListRef}>
        {skills.map((skill) => (
          <li key={skill.id}>
            <a onClick={() => handleSkillClick(skill)}>
              {skill.name}
            </a>
          </li>
        ))}
      </ul>
      <div className={`left-arrow ${scrollPosition < maxScrollValue - 20 ? 'active' : ''}`} onClick={scrollLeft}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </div>
    </div>
  );
}

export default Skills;
