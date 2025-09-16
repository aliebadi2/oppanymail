import React, { useState } from 'react';
import axios from 'axios';
import FileInput from '../../videoMentor/addVideo/FileInput/FileInput';
import './AddFile.css'; 
import config from '../../../../../../config';

const AddFile = ({ activePlanId }) => {
  const [fileTitle, setFileTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (file) => {
    setSelectedFile(file); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!fileTitle || !selectedFile) {
      alert('Please provide both file title and file.');
      return;
    }
  
    // Create FormData to hold the file data
    const formData = new FormData();
    formData.append('title', fileTitle); // Add file title
    formData.append('file', selectedFile); // Add the selected file

    try {
      const response = await axios.post(
        `${config.path}/mentor/courses/${activePlanId}/files`, 
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true, // Ensure that authentication credentials are included
        }
      );
  
      alert('File uploaded successfully!');
      console.log('Response from backend:', response.data);
      setFileTitle('');  // Reset the form
      setSelectedFile(null);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file.');
    }
  };

  return (
    <div className='add-mentor-section'>
      <div className='add-mentor-title-container'>فایل</div>
      <input
        type="text"
        placeholder='عنوان فایل'
        className='add-video-input-title'
        value={fileTitle}
        onChange={(e) => setFileTitle(e.target.value)} 
      />
      <FileInput onFileSelect={handleFileSelect} /> 
      <div className='add-mentor-send-button-container'>
        <button className='add-mentor-send-button' onClick={handleSubmit}>
          ارسال فایل
        </button>
      </div>
    </div>
  );
};

export default AddFile;
