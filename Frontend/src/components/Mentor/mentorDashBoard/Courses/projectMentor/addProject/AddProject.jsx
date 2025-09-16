import React, { useState } from 'react';
import './AddProject.css';

const AddProject = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUploadClick = () => {
    document.getElementById('file-upload').click();
  };

  return (
    <div className='add-project-section'>
      <div className='add-project-title-text-container'>
        <p className='add-project-title-text'>
          افزودن پروژه جدید برای کارآموز
        </p>
      </div>
      <input type="text" placeholder='نام' className='add-project-input-name' />
      <input type="text" placeholder='توضیحات' className='add-project-explain-name' />
      
      <div className='add-project-file-input-container'>
        <input type="text" className='add-project-file-input' placeholder='نام فایل' value={selectedFile ? selectedFile.name : ''} readOnly />
        <div className='add-project-file-button-container'>
          <button onClick={handleUploadClick} className='add-project-file-button'>
            بارگذاری فایل
          </button>
          <input type="file" id="file-upload" style={{ display: 'none' }} onChange={handleFileChange} />
        </div>
      </div>
      <div className='add-project-button-container'>
            <button className='add-project-button'>
            ارسال پروژه
            </button>
      </div>
    </div>
  );
}

export default AddProject;
