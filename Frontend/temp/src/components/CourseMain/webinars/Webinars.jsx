import React from 'react';
import './Webinars.css';

const Webinars = ({ webinars }) => {
  return (
    <div className="webinars-container">
      <table className="webinars-responsive-table">
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
                  className="webinars-connect-button"
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

export default Webinars;
