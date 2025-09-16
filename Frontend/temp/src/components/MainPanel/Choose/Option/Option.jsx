import React from 'react'
import Check from '../../../../assets/Frame 228.svg'
import "./Option.css"

function Option({option}) {
  return (
    <div className='option-tag'>
        <img src={Check} alt="" className='option-tag-check' />
        <div>{option}</div>
      
    </div>
  )
}

export default Option
