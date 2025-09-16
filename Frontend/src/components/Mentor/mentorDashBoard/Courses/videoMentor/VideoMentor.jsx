import React from 'react'
import VideoTable from './mentorTable/VideoMentorTable'
import "./VideoMentor.css"
import AddVideo from './addVideo/AddVideo'

const VideoMentor = ({videos}) => {
  return (
    <div className='video-mentor-section'>
        <div className='video-mentor-table-container'>
          <VideoTable videos={videos} />
        </div>
        <div >
          <AddVideo/>
        </div>
      
    </div>
  )
}

export default VideoMentor
