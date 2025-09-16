import React from 'react'
import './ProjectMentor.css'
import ProjectTable from './projectTable/ProjectTable'
import AddProject from './addProject/AddProject'

const ProjectMentor = ({projects}) => {
  return (
    <div className='project-mentor-container'>
        <div className='project-mentor-table-container'>
            <ProjectTable projects={projects} />

        </div>
        <div >
            <AddProject/>

        </div>
      
    </div>
  )
}

export default ProjectMentor
