import React, { useState, useEffect, useCallback } from 'react';
import './All_Mentors.css';
import MentorCard from '../MentorCard/MentorCard';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import config from '../../../config';

const AllMentors = () => {
  const [mentors, setMentors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMentors, setFilteredMentors] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  const { skill_id } = useParams();

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const url = skill_id
          ? `${config.path}/show-mentors/by-skills/${skill_id}`
          : `${config.path}/show-mentors/all`;

        const response = await axios.get(url);
        setMentors(response.data);
        setFilteredMentors(response.data);
      } catch (error) {
        console.error('Error fetching mentors:', error);
      }
    };

    fetchMentors();
  }, [skill_id]);

  const debounce = useCallback((func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  }, []);

  const debounceFilterMentors = debounce((value) => {
    const filtered = mentors.filter((mentor) => {
      const fullName = `${mentor.user_info.name} ${mentor.user_info.family_name}`.toLowerCase();
      const matchesName = fullName.includes(value.toLowerCase());
      const matchesSkills = mentor.user_info.skills_names.some((skillName) =>
        skillName.toLowerCase().includes(value.toLowerCase())
      );
      return matchesName || matchesSkills;
    });
    setFilteredMentors(filtered);
  }, 300);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value.length > 0) {
      setShowResults(true);
    } else {
      setShowResults(false);
      setFilteredMentors(mentors);
    }

    debounceFilterMentors(value);
  };

  const handleMentorClick = (mentor) => {
    navigate(`/mentor/profile/${mentor.username}`);
    setShowResults(false);
  };

  return (
    <div className='all-mentors-page'>
      <div className='all-mentors-upper-container'>
        <h1 className='all-mentor-upper-title'>
          به دنبال <span style={{ color: 'var(--dash-color)', fontWeight: '300' }}>منتور</span> ۱ به ۱ خود<span className='dynamic-text'></span> بگردید .
        </h1>
        <div className='all-mentors-search-input-box'>
          <input
            type="text"
            id="mentor-search"
            className='all-mentors-search-input'
            placeholder='جست و جو'
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button className='all-mentors-search-button'>جستجو</button>
        </div>
      </div>

      <div className='all-mentors-search-container'>
        {showResults && filteredMentors.length > 0 && (
          <div className='all-mentors-results-dropdown'>
            {filteredMentors.map((mentor) => (
              <div
                key={mentor.user_id}
                className='all-mentors-item'
                onClick={() => handleMentorClick(mentor)}
              >
                {mentor.user_info.name} {mentor.user_info.family_name}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className='mentor-card-list'>
        {filteredMentors.length > 0 ? (
          filteredMentors.map((mentor) => (
            <MentorCard key={mentor.user_id} mentorData={mentor} isSuggest={false} />
          ))
        ) : (
          <div className="no-mentors-message">
            به زودی منتور ها به این بخش اضافه خواهند شد
          </div>
        )}
      </div>
    </div>
  );
};

export default AllMentors;
