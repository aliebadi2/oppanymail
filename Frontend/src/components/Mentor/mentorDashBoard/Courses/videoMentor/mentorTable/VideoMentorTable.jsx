import React from 'react';
import './VideoMentorTable.css'; // Ensure to add your CSS file

const VideoMentorTable = ({ videos }) => {
  return (
    <div className="video-mentor-table">
      <table className="video-mentor-responsive-table">
        <thead>
          <tr>
            <th>عنوان فایل</th>
            <th>دانلود</th>
          </tr>
        </thead>
        <tbody>
          {videos.map((video, index) => (
            <tr key={index}>
              <td>{video.titleOfVideo}</td>
              <td>
                <a 
                  href={video.downloadLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="video-mentor-download-button"
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

export default VideoMentorTable;
