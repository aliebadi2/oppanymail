import React from 'react';
import './MantorFileTable.css'; // Ensure to add your CSS file

const MentorFileTable = ({ files }) => {
  return (
    <div className="mentor-file-table">
      <table className="mentor-responsive-table">
        <thead>
          <tr>
            <th>عنوان فایل</th>
            <th>دانلود</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file, index) => (
            <tr key={index}>
              <td>{file.fileTitle}</td>
              <td>
                <a 
                  href={file.fileDownloadLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="mentor-download-button"
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

export default MentorFileTable;
