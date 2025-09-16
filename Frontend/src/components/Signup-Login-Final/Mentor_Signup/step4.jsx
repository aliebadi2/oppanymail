import React from 'react';
import DragNdrop from "../../Components/drag/Drag";
import { FaRegCheckCircle, FaRegDotCircle } from 'react-icons/fa';
import './MentorSignup.css'
function Step4({ about, setResumeTextValue, selectedFiles, setSelectedFiles, setStep, handleSignUp, errorSignupMessages, setErrorSignupMessages }) {

  const handleSignupNextStep = (e) => {
    e.preventDefault(); 

    const errors = {};
    if (!about.trim()) {
      errors.about = true;
    }

    if (selectedFiles.length === 0) {
      errors.file = true;
    }

    setErrorSignupMessages(errors);

    if (Object.keys(errors).length === 0) {
      handleSignUp(e); 
    }
  };

  const handleInputChange = (field, value, setter) => {
    setter(value);
    setErrorSignupMessages((prevErrors) => ({ ...prevErrors, [field]: false }));
  };

  return (
    <div className="login-page-input-buttons">
      <div className="step-bar">
        <FaRegCheckCircle color="#4D7C0F" size={"1.5rem"} />
        <div className="step-line green-bg"></div>
        <FaRegCheckCircle color="#4D7C0F" size={"1.5rem"} />
        <div className="step-line green-bg"></div>
        <FaRegDotCircle color="#64748B" size={"1.5rem"} />
        <div className="step-line orange-bg"></div>
        <FaRegDotCircle color="#64748B" size={"1.5rem"} />
      </div>
      
      <textarea
        type="text"
        className={`resume-text-box ${errorSignupMessages.about ? 'input-field-error' : ''}`}
        placeholder="کمی در مورد خودتان برای ما بگویید"
        value={about}
        onChange={(e) => handleInputChange('about', e.target.value, setResumeTextValue)}
      />

      <div className={"drag-drop-container"}>
        <DragNdrop
            onFilesSelected={setSelectedFiles}
            files={selectedFiles} 
            error={!!errorSignupMessages.file}
        />
      </div>

      {errorSignupMessages.form && <p className="error-message">{errorSignupMessages.form}</p>} {/* Display backend errors */}

      <div className="signup-page-buttons">
        <button className="secondary-button signup-small-button" onClick={() => setStep(3)}>
          مرحله قبل
        </button>
        <button className="primary-button signup-small-button" onClick={handleSignupNextStep}>
          ثبت نام
        </button>
      </div>
    </div>
  );
}

export default Step4;
