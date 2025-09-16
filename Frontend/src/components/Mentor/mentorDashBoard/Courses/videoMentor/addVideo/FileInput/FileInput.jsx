import React, { useRef, useState } from "react";
import './FileInput.css';

const FileInput = ({ onFileSelect, placeholder }) => {
  const [fileName, setFileName] = useState("نام فایل"); // Placeholder for file name
  const fileInputRef = useRef(null);

  // Trigger file input click when the "Browse" button is clicked
  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  // Update the file name when a file is selected and pass the file to the parent component
  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      setFileName(selectedFile.name);
      onFileSelect(selectedFile); // Pass the selected file to parent
    }
  };

  return (
    <div className="file-upload-container">
      <input
        type="text"
        className="file-name-input"
        value={fileName}
        readOnly
      />
      <button className="file-upload-button" onClick={handleBrowseClick}>
        انتخاب فایل
      </button>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default FileInput;
