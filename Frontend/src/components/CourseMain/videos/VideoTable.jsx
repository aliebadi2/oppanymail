import React from 'react';
import './VideoTable.css';
import { Link } from 'react-router-dom';

const VideoTable = ( {videos} ) => {
    const data = [
        {
            download: "دانلود",
            actions: "عملیات"
        },
        {
            download: "دانلود",
            actions: "عملیات"
        },
        {
            download: "دانلود",
            actions: "عملیات"
        }
    ];

    return (
        <div className="mentee-video-table-container">
            <table className="mentee-responsive-table">
                <thead>
                    <tr>
                        <th>عنوان</th>
                        <th>دانلود</th>
                    </tr>
                </thead>
                <tbody>
                    {videos.map((video, index) => (
                        <tr key={index}>
                            
                            <td>
                                {video.titleOfVideo}
                            </td>
                            <td>
                                <Link to={video.downloadLink} className="download-button">دانلود</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default VideoTable;
