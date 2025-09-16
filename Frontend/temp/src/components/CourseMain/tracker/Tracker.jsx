import React from 'react';
import './Tracker.css';
import TrackerCard from './trackerCard/TrackerCard';

const Tracker = ({ milestones, nowLevel }) => {
  // Ensure `nowLevel` is a number for proper comparison
  const currentLevel = typeof nowLevel === 'string' ? parseInt(nowLevel, 10) : nowLevel;

  // Process milestones to update their types based on nowLevel
  const processedMilestones = milestones.map((milestone) => {
    console.log();
    if (milestone.level < currentLevel) {
      return { ...milestone, type: 'type1' }; // Completed (انجام شده)
    } else if (milestone.level === currentLevel) {
      return { ...milestone, type: 'type2' }; // Active (فعال)
    } else {
      return { ...milestone, type: 'type3' }; // Inactive (غیرفعال)
    }
  });

  return (
    <div className="tracker-container">
      <p className="tracker-explain-text">
        لطفا مراحل پیشرفت کارآموز خود را وارد کنید و میزان پیشرفت کارآموز خود را
        با توجه به موفقیت در این مدت مشخص کنید.(حداکثر ۹ مرحله)
      </p>
      <div className="tracker-card-container">
        {processedMilestones.map((milestone, index) => (
          <TrackerCard
            key={index}
            id={milestone.id} // Unique ID for the milestone
            level={milestone.level} // The milestone level
            type={milestone.type} // Dynamically updated type
            text={milestone.text} // Description text
            title={milestone.title} // Title of the milestone
          />
        ))}
      </div>
    </div>
  );
};

export default Tracker;
