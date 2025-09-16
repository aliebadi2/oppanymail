import React from 'react';
import './Files.css';

const Files = ({ files }) => {
  return (
    <div className="files-container">
      <table className="files-responsive-table">
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
                  className="files-download-button"
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

export default Files;
