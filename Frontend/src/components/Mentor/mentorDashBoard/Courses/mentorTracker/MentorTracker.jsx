import React, { useState } from 'react';
import axios from 'axios';
import './MentorTracker.css';
import MentorTrackerItem from './mentorTrackerItem/MentorTrackerItem';
import AddMilestone from './addMilestone/AddMilestone';

const MentorTracker = ({ trackers }) => {
  const [mentorItems, setMentorItems] = useState(trackers || []); // Initialize with `trackers` prop
  const [isAddMilestoneVisible, setIsAddMilestoneVisible] = useState(false);

  const handleAddMilestoneClick = () => {
    setIsAddMilestoneVisible(true);
  };

  const handleCloseAddMilestone = () => {
    setIsAddMilestoneVisible(false);
  };

  const handleSaveMilestone = async (id, updatedTitle, updatedDescription) => {
    try {
      const updatedItem = mentorItems.find((item) => item.id === id);

      if (!updatedItem) {
        console.error("Milestone not found");
        return;
      }

      const updatedMilestone = {
        ...updatedItem,
        title: updatedTitle,
        text: updatedDescription,
      };

      const response = await axios.put(`/api/milestones/${id}`, updatedMilestone);

      if (response.status === 200) {
        const updatedItems = mentorItems.map((item) =>
          item.id === id ? updatedMilestone : item
        );
        setMentorItems(updatedItems);
      } else {
        console.error("Failed to update milestone on the backend");
      }
    } catch (error) {
      console.error("Error updating milestone:", error);
    }
  };

  const handleDeleteMilestone = async (id) => {
    try {
      // Create a new list of milestones without the deleted one
      const updatedItems = mentorItems.filter((item) => item.id !== id);

      // Send the updated list to the backend
      const response = await axios.put('/api/milestones', { listOfMilestones: updatedItems });

      if (response.status === 200) {
        // Update the state with the new list of milestones
        setMentorItems(updatedItems);
        console.log("Milestone deleted successfully:", response.data);
      } else {
        console.error("Failed to delete milestone on the backend");
      }
    } catch (error) {
      console.error("Error deleting milestone:", error);
    }
  };

  return (
    <div className="mantor-tracker-container">
      <p className="tracker-explain-text">
        لطفا مراحل پیشرفت کارآموز خود را وارد کنید و میزان پیشرفت کارآموز خود را
        با توجه به موفقیت در این مدت مشخص کنید.(حداکثر ۹ مرحله)
      </p>
      <button
        className="tracker-add-Milestone-button"
        onClick={handleAddMilestoneClick}
      >
        افزودن مایلستون
      </button>
      {isAddMilestoneVisible && (
        <AddMilestone onClose={handleCloseAddMilestone} />
      )}
      <div className="tracker-card-container">
        {mentorItems.map((tracker) => (
          <MentorTrackerItem
            key={tracker.id}
            level={tracker.level}
            title={tracker.title}
            description={tracker.text}
            onSave={(updatedTitle, updatedDescription) =>
              handleSaveMilestone(tracker.id, updatedTitle, updatedDescription)
            }
            onDelete={() => handleDeleteMilestone(tracker.id)} // Pass the delete handler
          />
        ))}
      </div>
    </div>
  );
};

export default MentorTracker;
