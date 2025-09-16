import React, { useState } from "react";
import { FaRegCheckCircle, FaRegDotCircle } from "react-icons/fa";
import Select from "react-select";
import { FaUniversity } from "react-icons/fa";
import { SiYoutubestudio } from "react-icons/si";
import Inputfield from "../../Components/Input/Inputfield";

function Step3({ setStep, degree, setDegree, university, setUniversity, degree_title, setDegreeTitle }) {
  const [errorMessages, setErrorMessages] = useState({});

  const degreeOptions = [
    { value: "under_bachelor", label: "دیپلم" },
    { value: "bachelor", label: "لیسانس" },
    { value: "master", label: "فوق لیسانس" },
    { value: "phd", label: "دکترا" },
  ];

  const handleNextStep = () => {
    const errors = {};
    if (!degree) errors.degree = true;
    if (!university || !university.trim()) errors.university = true;
    if (!degree_title || !degree_title.trim()) errors.degree_title = true;

    setErrorMessages(errors);

    if (Object.keys(errors).length === 0) {
      setStep(4);
    }
  };

  const handleDegreeChange = (selectedOption) => {
    setDegree(selectedOption ? selectedOption.value : null);
    setErrorMessages((prevErrors) => ({ ...prevErrors, degree: false }));
  };

  const handleInputChange = (field, value, setter) => {
    setter(value);
    setErrorMessages((prevErrors) => ({ ...prevErrors, [field]: false }));
  };

  return (
    <div className="login-page-input-buttons">
      <div className="step-bar">
        <FaRegCheckCircle color="#4D7C0F" size={"1.5rem"} />
        <div className="step-line green-bg"></div>
        <FaRegCheckCircle color="#4D7C0F" size={"1.5rem"} />
        <div className="step-line green-bg"></div>
        <FaRegDotCircle color="#EA580C" size={"1.5rem"} />
        <div className="step-line orange-bg"></div>
        <FaRegDotCircle color="#64748B" size={"1.5rem"} />
      </div>
      <div className="login-page-inputs">
        <Inputfield
          type="text"
          placeholder="اخرین محل تحصیل"
          value={university}
          icon={<FaUniversity />}
          onChange={(e) => handleInputChange("university", e.target.value, setUniversity)}
          error={!!errorMessages.university}
        />

        <Inputfield
          type="text"
          placeholder="اخرین رشته‌ی تحصیلی"
          value={degree_title}
          icon={<SiYoutubestudio />}
          onChange={(e) => handleInputChange("degree_title", e.target.value, setDegreeTitle)}
          error={!!errorMessages.degree_title}
        />

        <div className="add-skill-inf-container">
          <div className="skills-container">
            <Select
              options={degreeOptions}
              onChange={handleDegreeChange}
              placeholder="اخرین مدرک تحصیلی"
              classNamePrefix={errorMessages.degree ? "react-select-error" : ""}
            />
          </div>
        </div>
      </div>

      <div className="signup-page-buttons">
        <button className="secondary-button signup-small-button" onClick={() => setStep(2)}>
          مرحله قبل
        </button>
        <button className="primary-button signup-small-button" onClick={handleNextStep}>
          مرحله بعد
        </button>
      </div>
    </div>
  );
}

export default Step3;
