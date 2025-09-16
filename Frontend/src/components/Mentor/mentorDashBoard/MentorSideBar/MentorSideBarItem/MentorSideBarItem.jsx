import React from 'react';
import "./MentorSideBarItem.css"

function MentorSideBarItem({ text, icon, className }) {
  return (
    <div className={`mentor-sb-item-container ${className}`}>
      <div className="mentor-sb-item-inner-container">
        <div className="mentor-sb-item-icon">
          {icon}
        </div>
        <div className="mentor-sb-item-text">
          {text}
        </div>
      </div>
    </div>
  );
}

export default MentorSideBarItem;
