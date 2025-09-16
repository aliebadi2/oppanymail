import React, { useState } from "react";
import Inputfield from "../../Components/Input/Inputfield";
import { GoPerson } from "react-icons/go";
import { FaRegEyeSlash, FaRegEye, FaRegDotCircle } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import Button from "../../Components/Button/Button"

function Step1({
  setStep,
  Name,
  setName,
  FamilyName,
  setFamilyName,
  email,
  setEmail,
  username,
  setUsername,
  password,
  setPassword,
  Repeatpassword,
  setRepeatPassword,
  showPassword,
  setShowPassword,
}) {
  const [errorMessages, setErrorMessages] = useState({});

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isStrongPassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

  const handleNextStep = (event) => {
    event.preventDefault(); // Prevent form submission default behavior
  
    const errors = {};
  
    if (!Name.trim()) errors.name = true;
    if (!FamilyName.trim()) errors.family_name = true;
    if (!username.trim()) errors.username = true;
    if (!email.trim() || !isValidEmail(email)) errors.email = true;
    if (!password.trim() || !isStrongPassword(password))
      errors.password = "رمز عبور باید شامل حروف کوچک، بزرگ، اعداد و کاراکتر خاص باشد.";
    if (password !== Repeatpassword) errors.repeatPassword = "رمز عبور و تکرار آن مطابقت ندارند.";
  
    setErrorMessages(errors);
  
    if (Object.keys(errors).length === 0) setStep(2);
  };
  

  return (
    <div className="login-page-input-buttons">
      <div className="step-bar">
        <FaRegDotCircle color="#EA580C" size={"1.5rem"} />
        <div className="step-line orange-bg"></div>
        <FaRegDotCircle color="#64748B" size={"1.5rem"} />
        <div className="step-line"></div>
        <FaRegDotCircle color="#64748B" size={"1.5rem"} />
        <div className="step-line"></div>
        <FaRegDotCircle color="#64748B" size={"1.5rem"} />
      </div>

      <div className="login-page-inputs">
        <Inputfield
          type="text"
          placeholder="نام کاربری"
          icon={<GoPerson />}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          error={!!errorMessages.username}
        />
        <Inputfield
          type="text"
          placeholder="نام"
          icon={<GoPerson />}
          value={Name}
          onChange={(e) => setName(e.target.value)}
          error={!!errorMessages.name}
        />
        <Inputfield
          type="text"
          placeholder="نام خانوادگی"
          icon={<GoPerson />}
          value={FamilyName}
          onChange={(e) => setFamilyName(e.target.value)}
          error={!!errorMessages.family_name}
        />
        <Inputfield
          type="email"
          placeholder="آدرس ایمیل"
          icon={<HiOutlineMail />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!errorMessages.email}
        />
        {errorMessages.email && <p className="error">{errorMessages.email}</p>}
        <Inputfield
          type={showPassword ? "password" : "text"}
          placeholder="رمز عبور"
          icon={showPassword ? <FaRegEyeSlash onClick={() => setShowPassword(!showPassword)} /> : <FaRegEye onClick={() => setShowPassword(!showPassword)} />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={!!errorMessages.password}
        />
        {errorMessages.password && <p className="password-error-message">{errorMessages.password}</p>}
        <Inputfield
          type={showPassword ? "password" : "text"}
          placeholder="تکرار رمز عبور"
          icon={showPassword ? <FaRegEyeSlash onClick={() => setShowPassword(!showPassword)} /> : <FaRegEye onClick={() => setShowPassword(!showPassword)} />}
          value={Repeatpassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
          error={!!errorMessages.repeatPassword}
        />
      </div>

      <div className="signup-page-buttons-sss">
        <button className="primary-button signup-big-button" onClick={handleNextStep}>
          مرحله بعد
        </button>
      </div>
    </div>
  );
}

export default Step1;
