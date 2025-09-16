import React, { useState } from 'react';
import axios from 'axios';
import FileInput from './FileInput/FileInput';
import './AddVideo.css';

const AddVideo = () => {
  const [videoTitle, setVideoTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (file) => {
    setSelectedFile(file); // Store the selected file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!videoTitle || !selectedFile) {
      alert('Please provide both video title and file.');
      return;
    }
  
    // Create FormData to hold the video data
    const formData = new FormData();
    formData.append('title', videoTitle); // Add video title
    formData.append('file', selectedFile); // Add the selected file
  
    // Log the FormData contents (for debugging purposes)
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value instanceof File ? value.name : value}`);
    }
  
    try {
      // Send the form data to the backend using axios
      const response = await axios.post('http://154.91.170.123:8000/api/upload-video', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Ensure correct headers for file upload
        },
      });
  
      console.log('Response from backend:', response.data);
      alert('Video uploaded successfully!');
    } catch (error) {
      console.error('Error uploading video:', error);
      alert('Failed to upload video.');
    }
  };
  

  return (
    <div className='add-mentor-section'>
      <div className='add-mentor-title-container'>ویدیو</div>
      <input
        type="text"
        placeholder='عنوان ویدیو'
        className='add-video-input-title'
        value={videoTitle}
        onChange={(e) => setVideoTitle(e.target.value)} // Store video title
      />
      <FileInput onFileSelect={handleFileSelect} /> {/* Pass file select handler */}
      <div className='add-mentor-send-button-container'>
        <button className='add-mentor-send-button' onClick={handleSubmit}>
          ارسال ویدیو
        </button>
      </div>
    </div>
  );
};

export default AddVideo;
