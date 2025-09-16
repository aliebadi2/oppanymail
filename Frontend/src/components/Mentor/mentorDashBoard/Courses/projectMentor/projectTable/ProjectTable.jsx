import React from 'react';
import './ProjectTabel.css'; // Ensure to add your CSS file

const ProjectTable = ({ projects }) => {
  return (
    <div className="project-table-container">
      <table className="project-responsive-table">
        <thead>
          <tr>
            <th>نام پروژه</th>
            <th>دانلود پاسخ</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project, index) => (
            <tr key={index}>
              <td>{project.nameOfProject}</td>
              <td>
                <a 
                  href={project.downloadLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="project-download-button"
                >
                  دانلود
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectTable;
