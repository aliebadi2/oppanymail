import React, { useState, useEffect } from "react";
import Inputfield from "../../Components/Input/Inputfield";
import { GoPerson } from "react-icons/go";
import { MdLocationCity } from "react-icons/md";
import Select from "react-select";
import { FaRegCheckCircle, FaRegDotCircle } from "react-icons/fa";
import axios from "axios";
import config from "../../../config";
import "./MentorSignup.css";

function Step2({
  setStep,
  job_tittle,
  setJob,
  company,
  setCompany,
  city,
  setLocation,
  country,
  setCountry,
  skills,
  setSkills,
  availableSkills,
  setAvailableSkills,
}) {
  const [errorMessages, setErrorMessages] = useState({});

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axios.get(`${config.path}/skills`);
        const skillOptions = response.data.map((skill) => ({
          value: skill.id,
          label: skill.name,
        }));
        setAvailableSkills(skillOptions);
      } catch (error) {
        console.error("Failed to fetch skills", error);
      }
    };
    fetchSkills();
  }, [setAvailableSkills]);

  const handleSkillChange = (selectedOptions) => {
    setSkills(selectedOptions.map((option) => option.value));
    setErrorMessages((prevErrors) => ({ ...prevErrors, skills: false }));
  };

  const handleInputChange = (field, value, setter) => {
    setter(value);
    setErrorMessages((prevErrors) => ({ ...prevErrors, [field]: false }));
  };

  const handleNextStep = (event) => {
    event.preventDefault();
    const errors = {};
    if (!(job_tittle || "").trim()) errors.job_tittle = true;
    if (!(company || "").trim()) errors.company = true;
    if (!(city || "").trim()) errors.city = true;
    if (!(country || "").trim()) errors.country = true;
    if (skills.length === 0) errors.skills = true;

    setErrorMessages(errors);

    if (Object.keys(errors).length === 0) {
      setStep(3);
    }
  };

  return (
    <div className="login-page-input-buttons">
      <div className="step-bar">
        <FaRegCheckCircle color="#4D7C0F" size={"1.5rem"} />
        <div className="step-line green-bg"></div>
        <FaRegDotCircle color="#EA580C" size={"1.5rem"} />
        <div className="step-line orange-bg"></div>
        <FaRegDotCircle color="#64748B" size={"1.5rem"} />
        <div className="step-line"></div>
        <FaRegDotCircle color="#64748B" size={"1.5rem"} />
      </div>
      <div className="login-page-inputs">
        <Inputfield
          type="text"
          placeholder="عنوان شغل"
          icon={<GoPerson />}
          value={job_tittle}
          onChange={(e) => handleInputChange("job_tittle", e.target.value, setJob)}
          error={!!errorMessages.job_tittle}
        />

        <Inputfield
          type="text"
          placeholder="شرکت یا سازمان"
          icon={<MdLocationCity />}
          value={company}
          onChange={(e) => handleInputChange("company", e.target.value, setCompany)}
          error={!!errorMessages.company}
        />

        <Inputfield
          type="text"
          placeholder="شهر محل سکونت"
          icon={<MdLocationCity />}
          value={city}
          onChange={(e) => handleInputChange("city", e.target.value, setLocation)}
          error={!!errorMessages.city}
        />

        <Inputfield
          type="text"
          placeholder="کشور"
          icon={<MdLocationCity />}
          value={country}
          onChange={(e) => handleInputChange("country", e.target.value, setCountry)}
          error={!!errorMessages.country}
        />

        <div className="add-skill-inf-container">
          <div className="skills-container">
            <Select
              isMulti
              options={availableSkills}
              onChange={handleSkillChange}
              placeholder="انتخاب مهارت‌ها..."
              classNamePrefix={errorMessages.skills ? "input-error" : ""}
              styles={{
                control: (provided) => ({
                  ...provided,
                  borderColor: errorMessages.skills ? "red" : provided.borderColor,
                  "&:hover": {
                    borderColor: errorMessages.skills ? "red" : provided.borderColor,
                  },
                }),
                menuList: (provided) => ({
                  ...provided,
                  maxHeight: "150px",
                  overflowY: "auto",
                }),
              }}
            />
            {errorMessages.skills && <p className="error-message">لطفاً حداقل یک مهارت انتخاب کنید</p>}
          </div>
        </div>
      </div>
      <div className="signup-page-buttons">
        <button className="secondary-button signup-small-button" onClick={() => setStep(1)}>
          مرحله قبل
        </button>
        <button className="primary-button signup-small-button" onClick={handleNextStep}>
          مرحله بعد
        </button>
      </div>
    </div>
  );
}

export default Step2;
