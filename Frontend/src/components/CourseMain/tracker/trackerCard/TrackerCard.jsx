import React from 'react';
import './TrackerCard.css';

const TrackerCard = ({ level, text, type, title }) => {
  // Renders the main content of the card based on type
  const renderContent = () => {
    switch (type) {
      case 'type1': // Completed milestone
        return (
          <div className="t-c-1-container">
            <div className="t-c-level-container">
              <div className="t-c-level-text-container">{renderLevel()}</div>
              <div className="t-c-activation-text-container">انجام شده</div>
            </div>
            <div className="t-c-main-level-container">
              <div className="t-c-main-level-text-container">{title}</div>
            </div>
            <div className="t-c-explain-container">{text}</div>
          </div>
        );
      case 'type2': // Active milestone
        return (
          <div className="t-c-1-container">
            <div className="t-c-level-container">
              <div className="t-c-level-text-container">{renderLevel()}</div>
              <div className="t-c-activation-text-container">در حال انجام</div>
            </div>
            <div className="t-c-main-level-container">
              <div className="t-c-main-level-text-container">{title}</div>
            </div>
            <div className="t-c-explain-container">{text}</div>
          </div>
        );
      case 'type3': // Inactive milestone
        return (
          <div className="t-c-1-container t-c-gray">
            <div className="t-c-level-container">
              <div className="t-c-level-text-container">{renderLevel()}</div>
              <div className="t-c-activation-text-container">غیرفعال</div>
            </div>
            <div className="t-c-main-level-container">
              <div className="t-c-main-level-text-container">{title}</div>
            </div>
            <div className="t-c-explain-container">{text}</div>
          </div>
        );
      default:
        return <p>No type selected</p>;
    }
  };

  // Renders the level (e.g., "مرحله اول")
  const renderLevel = () => {
    const levels = [
      "مرحله اول",
      "مرحله دوم",
      "مرحله سوم",
      "مرحله چهارم",
      "مرحله پنجم",
      "مرحله ششم",
      "مرحله هفتم",
      "مرحله هشتم",
      "مرحله نهم",
    ];
    return <div className="t-c-level-text">{levels[level - 1]}</div>;
  };

  return <div>{renderContent()}</div>;
};

export default TrackerCard;
