import React, { useEffect, useRef } from 'react';
import './MainPanel.css';
import Hero from '../Hero/Hero';
import Skills from '../Skills/Skills';
import MentorSuggest from '../../ShowMentors/MentorSuggest/MentorSuggest';
import HowWorks from '../HowWorks/HowWorks';
import Comments from '../Comments/Comments';
import HomePanelCommonQuestions from '../CommonQuestions/HomePanelCommonQuestions';
import Choose from '../Choose/Choose';

function MainPanel() {
  const sectionsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); 
          }
        });
      },
      { threshold: 0.2 } 
    );

    sectionsRef.current.forEach(section => {
      if (section) {
        observer.observe(section);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className='main-panel-page'>
      <Skills />
      
      <div className="section" ref={el => sectionsRef.current[0] = el}>
        <Hero />
      </div>
      <div className="section" ref={el => sectionsRef.current[1] = el}>
        <MentorSuggest />
      </div>
      <div className="section" ref={el => sectionsRef.current[2] = el}>
        <Choose />
      </div>
      <div className="section" ref={el => sectionsRef.current[3] = el}>
        <HowWorks />
      </div>
      <div className="section" ref={el => sectionsRef.current[4] = el}>
        <Comments />
      </div>
      <div className="section" ref={el => sectionsRef.current[5] = el}>
        <HomePanelCommonQuestions />
      </div>
    </div> 
  );
}

export default MainPanel;
