import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Step1 from "./step1";
import Step2 from "./step2";
import Step3 from "./step3";
import Step4 from "./step4";
import Step5 from "./step5";
import "./MentorSignup.css";
import Loginimage from "../../../assets/loginImage.png";
import config from "../../../config";

function MentorSignup() {
  const [step, setStep] = useState(1);

  const [Name, setName] = useState("");
  const [FamilyName, setFamilyName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [Repeatpassword, setRepeatPassword] = useState("");
  const [email, setEmail] = useState("");
  const [job_tittle, setJob] = useState("");
  const [company, setCompany] = useState("");
  const [city, setLocation] = useState("");
  const [skills, setSkills] = useState([]);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [degree, setDegree] = useState("");
  const [university, setUniversity] = useState("");
  const [country, setCountry] = useState("");
  const [degree_title, setDegreeTitle] = useState("");
  const [about, setResumeTextValue] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showPassword, setShowPassword] = useState(true);
  const [errorMessages, setErrorMessages] = useState({});
  const [errorSignupMessages, setErrorSignupMessages] = useState({});
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("email", email);
    formData.append("name", Name);
    formData.append("family_name", FamilyName);
    formData.append("city", city);
    formData.append("country", country);
    formData.append("degree", degree);
    formData.append("field_of_study", degree_title);
    formData.append("university", university);
    formData.append("skills", JSON.stringify(skills));
    formData.append("bio", about);

    if (selectedFiles.length > 0) {
      formData.append("file", selectedFiles[0]);
    } else {
      setErrorSignupMessages({ file: "لطفاً فایل رزومه را انتخاب کنید." });
      return;
    }

    try {
      const response = await axios.post(`${config.path}/signup/mentor`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        setErrorSignupMessages({});
        setStep(5);
      }
    } catch (err) {
      if (err.response) {
        switch (err.response.status) {
          case 400:
            setErrorSignupMessages({ form: "ایمیل یا نام کاربری قبلاً استفاده شده است." });
            break;
          case 422:
            setErrorSignupMessages({ form: "اطلاعات ارسال‌شده نامعتبر است. لطفاً بررسی کنید." });
            break;
          case 500:
            setErrorSignupMessages({ form: "خطای سرور! لطفاً بعداً تلاش کنید." });
            break;
          default:
            setErrorSignupMessages({ form: "ثبت نام انجام نشد. لطفاً دوباره تلاش کنید." });
        }
      } else {
        setErrorSignupMessages({ form: "خطای اتصال به سرور! لطفاً بعداً تلاش کنید." });
      }
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Step1
            {...{ setStep, Name, setName, FamilyName, setFamilyName, email, setEmail, username, setUsername, password, setPassword, Repeatpassword, setRepeatPassword, showPassword, setShowPassword }}
          />
        );
      case 2:
        return (
          <Step2
            {...{ setStep, job_tittle, setJob, company, setCompany, city, setLocation, country, setCountry, skills, setSkills, availableSkills, setAvailableSkills }}
          />
        );
      case 3:
        return (
          <Step3
            {...{ setStep, degree, setDegree, university, setUniversity, degree_title, setDegreeTitle }}
          />
        );
      case 4:
        return (
          <Step4
            {...{ about, setResumeTextValue, selectedFiles, setSelectedFiles, setStep, handleSignUp, errorSignupMessages, setErrorSignupMessages }}
          />
        );
      case 5:
        return <Step5 {...{ errorMessages, setStep }} />;
      default:
        return null;
    }
  };

  return (
    <div className="login-page">
      <div className="login-page-content">
        <div className="login-page-title">
          <h1 className="login-page-title-title">ثبت نام به عنوان منتور</h1>
          <h2 className="login-page-title-discription">برای شروع آموزش ثبت نام کنید</h2>
        </div>

        <form>
          {renderStep()}
          {errorMessages.file && <p className="error">{errorMessages.file}</p>}
          {errorMessages.form && <p className="error">{errorMessages.form}</p>}
        </form>
      </div>

      <img className="login-page-image" src={Loginimage} alt="login-page image" />
    </div>
  );
}

export default MentorSignup;
