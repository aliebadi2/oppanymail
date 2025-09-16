import React from 'react'
import "./skillTag.css"
import { IoClose } from "react-icons/io5";
const SkillTag = ({skill, onRemove}) => {
  return (
    <div className='skill-tag-container'>
        <div className='skill-tag-skill-container'>
            {skill}
        </div>
        <IoClose  
        className='skill-tag-close-icon'
        onClick={() => onRemove(skill)}/>

      
    </div>
  )
}

export default SkillTag
