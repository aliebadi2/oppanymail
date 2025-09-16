import React, { useState } from 'react';
import './AddWebinar.css';
import DateInput from './dateInput/DateInput'; // Assuming you already have DateInput component
import axios from 'axios'; // If you're using axios for HTTP requests

import 'react-datepicker/dist/react-datepicker.css';

const AddWebinar = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');

  // Handle file change

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a FormData object to send the data
    const formData = new FormData();
    formData.append('name', name);
    formData.append('date', selectedDate);
    formData.append('duration', duration);
    

    // Log the form data to the console
    console.log('Form Data to be sent:');
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    try {
      // Send the data to the backend using axios or fetch
      const response = await axios.post('/api/webinars', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Log the success response from the backend
      console.log('Webinar added successfully:', response.data);
    } catch (error) {
      // Log any error that occurs during the request
      console.error('Error adding webinar:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='add-project-section'>
      <div className='add-project-title-text-container'>
        <p className='add-project-title-text'>
          افزودن وبینار خصوصی برای کارآموز
        </p>
      </div>

      <input
        type='text'
        placeholder='نام'
        className='add-project-input-name'
        value={name}
        onChange={(e) => setName(e.target.value)} // Set name state
      />

      <DateInput onChange={(date) => setSelectedDate(date)} /> {/* Assuming DateInput returns a date */}
      
      <input
        type='text'
        placeholder='مدت زمان (دقیقه)'
        className='add-project-explain-name'
        value={duration}
        onChange={(e) => setDuration(e.target.value)} // Set duration state
      />

     

      <div className='add-project-button-container'>
        <button type='submit' className='add-project-button'>
          اضافه
        </button>
      </div>
    </form>
  );
};

export default AddWebinar;
