import React from 'react'
import './WebinarMentor.css'
import WebinarTableMentor from './webinarTableMentor/WebinarTableMentor'
import AddWebinar from './addWebinar/AddWebinar'
const WebinarMentor = ({webinars}) => {
  return (
    <div className='webinr-mentor-container'>
      <div className='webinar-mentor-table-container'>
            <WebinarTableMentor webinars={webinars}/>
      </div>
      <div>
        <AddWebinar/>
      </div>
    </div>
  )
}

export default WebinarMentor
