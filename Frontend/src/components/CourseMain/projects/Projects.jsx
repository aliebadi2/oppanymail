import React from 'react';
import './Projects.css';

const Projects = ({projects}) => {
    

    return (
        <div className="projects-container">
            <table className="projects-responsive-table">
                <thead>
                    <tr>
                        <th>نام پروژه</th>
                        <th>توضیحات</th>
                        <th>عملیات</th>
                        <th>آپلود پاسخ</th>
                    </tr>
                </thead>
                <tbody>
                    {projects.map((project, index) => (
                        <tr key={index}>
                            <td>{project.nameOfProject}</td>
                            <td>{project.explanation}</td>
                            <td>
                                {project.operation}
                            </td>
                            <td>
                                <button >ارسال</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Projects;
