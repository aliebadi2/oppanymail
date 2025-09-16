import "./Specs.css"
import React from 'react'
import SpecTag from "./specTag/SpecTag"

function Specs({ skills }) {
  return (
    <div className="specs-container">
        <div className="specs-container-records">
          
          {skills.map((skill, index) => (
            <SpecTag key={index}>
              {skill}
            </SpecTag>
          ))}
        </div>
    </div>
  )
}

export default Specs;
