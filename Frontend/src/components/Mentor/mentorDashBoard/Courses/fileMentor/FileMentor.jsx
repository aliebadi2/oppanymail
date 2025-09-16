import './FileMentor.css'
import AddFile from './addFile/AddFile'

import MentorFileTable from './mentorFileTable/MentorFileTable'

import React from 'react'

const FileMentor = ({files}) => {
  return (
    <div className='file-mentor-section'>
        <div className='file-mentor-table-container'>
            <MentorFileTable files={files}/>
        </div>
        <div>
            <AddFile/>
        </div>
      
    </div>
  )
}

export default FileMentor
