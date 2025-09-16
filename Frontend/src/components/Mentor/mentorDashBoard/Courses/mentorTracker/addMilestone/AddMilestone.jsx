import React, { useState } from 'react';
import './AddMilestone.css';
import closeIcon from '../../../../../../assets/Close.svg';

const AddMilestone = ({ onClose }) => {
  const [milestoneTitle, setMilestoneTitle] = useState('');
  const [milestoneExplain, setMilestoneExplain] = useState('');

  const handleAddMilestone = async () => {
    // Create JSON object from input data
    const milestoneData = {
      title: milestoneTitle,
      explanation: milestoneExplain,
    };
    console.log(milestoneData)

    try {
      // Send the JSON object to the backend
      const response = await fetch('https://your-backend-endpoint.com/api/milestones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(milestoneData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log('Success:', result);

      // Optionally, reset the form after successful submission
      setMilestoneTitle('');
      setMilestoneExplain('');

      // Close the AddMilestone component after submission
      onClose();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className='add-milestone-container'>
      <div className='add-milestone-close-button-container'>
        <button onClick={onClose}>
          <img src={closeIcon} alt="close-icon" />
        </button>
      </div>
      <div className='add-milestone-warning-container'>
        <p className='add-milestone-warning'>
          می‌توانید حداکثر ۹ مرحله را وارد کنید.
        </p>
      </div>
      <div className='add-milestone-title-label-container'>
        <p className='add-milestone-title-label'>
          عنوان مرحله را وارد کنید.
        </p>
      </div>
      <input
        type="text"
        placeholder='مثال گام اول طراحی محصول'
        className='add-milestone-level-input'
        value={milestoneTitle}
        onChange={(e) => setMilestoneTitle(e.target.value)}
      />
      <div className='add-milestone-warning-container'>
        <p className='add-milestone-warning'>
          توضیح مرحله را وارد کنید.
        </p>
      </div>
      <input
        type="text"
        placeholder='مثال گام اول طراحی محصول'
        className='add-milestone-explain-input'
        value={milestoneExplain}
        onChange={(e) => setMilestoneExplain(e.target.value)}
      />
      <div className='add-milestone-button-container'>
        <button className='add-milestone-button' onClick={handleAddMilestone}>
          افزودن مرحله
        </button>
      </div>
    </div>
  );
}

export default AddMilestone;
