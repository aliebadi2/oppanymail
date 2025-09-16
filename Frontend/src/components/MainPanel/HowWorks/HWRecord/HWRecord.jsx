import React from 'react'
import './HWRecord.css'
  
const HWRecord = ({ imageSrc, title, description }) => {
  
    return (
      <div className='hwr-section'>
        <div className='hwr-image'>
          
          <img src={imageSrc} alt={title} className='hwr-icon'/>
        </div>
        <div className='hwr-bottom-container'>
            <div className='hwr-title'>
                {title}
            </div>
            <div className='hwr-description'>
            <p>{description}</p>
            </div>
        </div>
        
      </div>
    );
  };
  
  export default HWRecord;