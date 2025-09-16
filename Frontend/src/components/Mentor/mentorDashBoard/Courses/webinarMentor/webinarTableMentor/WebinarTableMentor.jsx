import React from 'react';
import './WebinarTableMentor.css'; // Ensure to add your CSS file

const WebinarTableMentor = ({ webinars }) => {
  return (
    <div className="webinar-table-container">
      <table className="webinar-responsive-table">
        <thead>
          <tr>
            <th>نام وبینار</th>
            <th>تاریخ و ساعت</th>
            <th>اتصال</th>
          </tr>
        </thead>
        <tbody>
          {webinars.map((webinar, index) => (
            <tr key={index}>
              <td>{webinar.webinarName}</td>
              <td>{webinar.dateAndTime}</td>
              <td>
                <a 
                  href={webinar.webinarLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="webinar-connect-button"
                >
                  اتصال
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WebinarTableMentor;
