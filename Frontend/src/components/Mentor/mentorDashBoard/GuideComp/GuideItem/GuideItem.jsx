import React from 'react'
import noteIcon from "../../../../../assets/Vector(1).svg"
import "./GuideItem.css"

function GuideItem({text}) {
  return (
    <div className='guide-item-component'>
        <div className='guide-item-icon-container'>
        <img src={noteIcon} alt="guide icon" className='guide-item-icon' />
        </div>
        <div className='guide-item-text'>
            {text}
        </div>
      
    </div>
  )
}

export default GuideItem
