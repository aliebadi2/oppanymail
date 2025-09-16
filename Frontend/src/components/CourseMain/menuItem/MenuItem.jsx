import React from 'react';
import './MenuItem.css';

const MenuItem = ({ icon, title, isSelected, onClick }) => {
  return (
    <div className='menu-item-container' onClick={onClick}>
      <div className='menu-item-inner-container'>
        <img 
          src={icon} 
          alt="item-icon" 
          className={isSelected ? 'selected' : 'unselected'} 
        />
        <div className={`menu-item-title ${isSelected ? 'selected' : 'unselected'}`}>
          {title}
        </div>
      </div>
      {isSelected && (
        <div className='menu-item-inner-line-container'>
          <div className='menu-item-inner-line'></div>
        </div>
      )}
    </div>
  );
};

export default MenuItem;
