import React from 'react'
import "./GuideSec.css"
import GuideComp from '../GuideComp/GuideComp'

function GuidSec() {
  return (
    <div className='guide-sec-component'>
      <div className='guide-sec-inner-component'>
        <GuideComp
          header={"برای منتی‌ها"}
          uHeader={"برای تجربه ای آرام با مربی خود"}
        />
        <GuideComp
          header={"برای منتورها"}
          uHeader={"برای تجربه ای آرام با منتی خود"}
        />
      </div>
    </div>
  )
}

export default GuidSec
