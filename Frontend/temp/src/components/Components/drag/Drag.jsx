import React, { useEffect, useRef } from "react";
import { AiOutlineCheckCircle, AiOutlineCloudUpload } from "react-icons/ai";
import { MdClear } from "react-icons/md";
import "./Drag.css";

const DragNdrop = ({ onFilesSelected, files, width, height, error }) => {
  const fileInputRef = useRef(null); // Reference to the file input

  const handleFileChange = (event) => {
    const selectedFiles = event.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const newFiles = Array.from(selectedFiles);
      onFilesSelected((prevFiles) => [...prevFiles, ...newFiles]);
    }

    // Reset the file input so the same file can be selected again
    fileInputRef.current.value = null;
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles.length > 0) {
      const newFiles = Array.from(droppedFiles);
      onFilesSelected((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const handleRemoveFile = (index) => {
    onFilesSelected((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <section className={`drag-drop ${files.length > 0 ? "upload-box active" : "upload-box"} ${error ? "upload-error" : ""}`} 
            style={{ width: width, height: height }}>
      <div
        className="document-uploader"
        onDrop={handleDrop}
        onDragOver={(event) => event.preventDefault()}
      >
        <div className="upload-info">
          <AiOutlineCloudUpload />
          <div>
            <p>
              بکشید و رها کنید یا در فایل‌ها
              <label htmlFor="browse" className="browse-btn">
                جست‌وجو
              </label>
              کنید
            </p>
          </div>
        </div>
        <input
          type="file"
          hidden
          id="browse"
          ref={fileInputRef} // Bind the file input reference
          onChange={handleFileChange}
          accept=".pdf,.docx,.pptx,.txt,.xlsx"
          multiple
        />

        {files.length > 0 && (
          <div className="file-list">
            <div className="file-list__container">
              {files.map((file, index) => (
                <div className="file-item" key={index}>
                  <div className="file-info">
                    <p>{file.name}</p>
                  </div>
                  <div className="file-actions">
                    <MdClear onClick={() => handleRemoveFile(index)} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {files.length > 0 && (
          <div className="success-file">
            <AiOutlineCheckCircle
              style={{ color: "#6DC24B", marginRight: 1 }}
            />
            <p>{files.length} فایل انتخاب شده</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default DragNdrop;
