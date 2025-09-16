import React from 'react'
import "./InfItem.css"
const InfItem = ({icon, title, information}) => {
  return (
    <div className='inf-item-section'>
        <img src={icon} alt="icon" className='inf-item-icon' />
        <p className='inf-item-title'>{title}</p>
        <p className='inf-item-information'>{information}</p>
      
    </div>
  )
}

export default InfItem
