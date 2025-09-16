import React from 'react';
import "./MenteeSideBarItem.css";

function MenteeSideBarItem({ text, icon, className }) {
  return (
    <div className={`mentee-dashboard-sb-item-container ${className}`}>
      <div className="mentee-dashboard-sb-item-inner-container">
        <div className="mentee-dashboard-sb-item-icon">
          {icon}
        </div>
        <div className="mentee-dashboard-sb-item-text">
          {text}
        </div>
      </div>
    </div>
  );
}

export default MenteeSideBarItem;
