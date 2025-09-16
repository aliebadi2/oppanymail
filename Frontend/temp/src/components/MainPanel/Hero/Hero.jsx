import React, { useState, useEffect, useCallback } from 'react';
import './Hero.css';
import searchIcon from '../../../assets/Vector.svg';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import config from '../../../config';

function Hero() {
  const [mentors, setMentors] = useState([]); 
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMentors, setFilteredMentors] = useState([]); 
  const [showResults, setShowResults] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all mentors' information
    axios.get(`${config.path}/show-mentors/all`, { withCredentials: true })
      .then(response => {
        setMentors(response.data);
      })
      .catch(error => {
        console.error('Error fetching mentors:', error);
      });
  }, []);

  // Debounce function for search
  const debounce = useCallback((func, delay) => {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  }, []);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value); 

    if (value.length > 0) {
      setShowResults(true); 
    } else {
      setShowResults(false); 
    }

    debounceFilterMentors(value);
  };

  // Filter mentors based on the search term
  const debounceFilterMentors = debounce((value) => {
    const filtered = mentors.filter(mentor => {
      const fullName = `${mentor.user_info?.name || ''} ${mentor.user_info?.family_name || ''}`.toLowerCase();
      
      const matchesName = fullName.includes(value.toLowerCase());
      const matchesSkills = mentor.user_info?.skills?.some(skill => 
        skill.skill_name?.toLowerCase().includes(value.toLowerCase())
      );
      
      return matchesName || matchesSkills;
    });
    setFilteredMentors(filtered);
  }, 300);

  const handleMentorClick = (mentor) => {
    navigate(`/mentor/profile/${mentor.username}`); 
    setShowResults(false); 
  };

  return (
    <div className='hero-section'>
      <div className='hero-right-container'>
        <div className='hero-title-container'>
          با منتورینگ <span style={{ color: '#EB5E28' }}>سریع تر</span> به اهداف شغلی خود برسید
        </div>
        <div className='hero-mentor-text'>
          با کمک منتورها، مهارت‌های جدید یاد بگیرید و مسیر شغلی خود را بهبود بخشید
        </div>
        <div className='hero-search-container'>
          <label className='hero-search-label' htmlFor="mentor-search">منتور خود را پیدا کنید</label>
          <div className='hero-search-box-button'>
            <div className='hero-search-input-box'>
              <input
                type="text"
                id="mentor-search"
                className='hero-search-input'
                placeholder='جست و جو'
                value={searchTerm}
                onChange={handleSearchChange} 
              />
              <button className='hero-search-icon-button' aria-label="Search">
                <img src={searchIcon} alt="Search Icon" className='hero-search-icon' />
              </button>
            </div>

            {showResults && filteredMentors.length > 0 && (
              <div className='mentor-results-dropdown'>
                {filteredMentors.map(mentor => (
                  <div
                    key={mentor.user_id}
                    className='mentor-item'
                    onClick={() => handleMentorClick(mentor)} 
                  >
                    {mentor.user_info?.name} {mentor.user_info?.family_name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
