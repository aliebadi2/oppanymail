import React, { useState } from 'react';
import './QuestionComponent.css';
import { FaChevronDown } from "react-icons/fa6";

function QuestionComponent(props) {
  const [showText, setShowText] = useState(false);
  const [expandDiv, setExpandDiv] = useState(false);

  const handleButtonClick = () => {
    setShowText(!showText);
    setExpandDiv(!expandDiv);
  };

  return (
    <div className='question-box'>
      <div className='question-title-icon'>
        <h2 className='question-title'>{props.title}</h2>
        <icon className='question-icon' onClick={handleButtonClick} style={{ transform: showText ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.5s' }}>
          <FaChevronDown />
        </icon>
      </div>
      <div style={{ height: expandDiv ? '6rem' : '1rem', transition: 'height 0.5s' }}>
        {showText && <p className='question-description'>{props.text}</p>}
      </div>
    </div>
  );
}

export default QuestionComponent;
