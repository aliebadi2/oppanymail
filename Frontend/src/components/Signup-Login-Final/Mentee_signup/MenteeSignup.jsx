import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Inputfield from "../../Components/Input/Inputfield";
import "./SignUppage.css";
import Loginimage from "../../../assets/loginImage.png";
import { GoPerson } from "react-icons/go";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { FaRegCheckCircle, FaRegDotCircle } from "react-icons/fa";
import config from "../../../config";

function MenteeSignup() {
  const [name, setName] = useState("");
  const [family_name, setFamilyName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [nameError, setNameError] = useState("");
  const [familyNameError, setFamilyNameError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [isSignedUp, setIsSignedUp] = useState(false);

  const handleIconClick = () => {
    setShowPassword(!showPassword);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setNameError("");
    setFamilyNameError("");
    setUsernameError("");
    setEmailError("");
    setPasswordError("");
    setError("");
    if  (!name){
      setNameError("نام را وارد کنید!");
      setError(nameError)
    } 
    if (!family_name){
      setFamilyNameError("نام خانوادگی را وارد کنید!");
      setError(familyNameError)
    } 
    if (!username){
      setUsernameError("نام کاربری را وارد کنید!");
      setError(usernameError)
    } 
    if (!email){
      setEmailError("ایمیل را وارد کنید!")
      setError(emailError)
    } 
    if(!password){
      setPasswordError("رمز عبور و تکرار آن را وارد کنید")
      setError(passwordError)
    }
    if (password !== repeatPassword){
      setError("رمز عبور با تکرار آن مطابقت ندارد!");
      setPasswordError("رمز عبور با تکرار آن مطابقت ندارد!")
    }
      
    if (!name || !family_name || !username || password !== repeatPassword) return;
    const requestData = new URLSearchParams();
    requestData.append("name", name);
    requestData.append("family_name", family_name);
    requestData.append("username", username);
    requestData.append("email", email);
    requestData.append("password", password);
    try {
      setIsSubmitting(true);
      const response = await axios.post(`${config.path}/signup/mentee`, requestData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      if (response.status === 200) {
        setError("");
        setIsSignedUp(true);
      }
    } catch (err) {
      switch (err.response?.status) {
        case 400:
          setError("درخواست اشتباه است، لطفاً دوباره تلاش کنید.");
          break;
        case 409:
          setError("این ایمیل قبلاً ثبت شده است!");
          break;
        case 422:
          setError("اطلاعات ورودی نادرست است. لطفاً بررسی کنید.");
          break;
        case 500:
          setError("خطای سرور، لطفاً بعداً دوباره تلاش کنید.");
          break;
        default:
          setError("ثبت نام ناموفق بود، بعد از چند لحظه دوباره تلاش کنید.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isSignedUp) {
    return (
      <div className="login-page">
        <div className="login-page-content">
          <div className="login-page-title">
            <h1 className="login-page-title-title">ثبت نام به عنوان منتی</h1>
          </div>
          <div className="step-bar-container-mentee">
            <div className="step-bar-mentee">
              <FaRegCheckCircle color="#4D7C0F" size={"1.5rem"} />
              <div className="step-line-mentee"></div>
              <FaRegDotCircle color="#64748B" size={"1.5rem"} />
            </div>
          </div>
          <form onSubmit={handleSignUp} autoComplete="off">
            <div className="login-page-input-buttons">
              <div className="login-page-inputs">
                <Inputfield
                  type="text"
                  placeholder="نام"
                  icon={<GoPerson />}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={nameError !== ""}
                  autoComplete="off"
                />
                <Inputfield
                  type="text"
                  placeholder="نام خانوادگی"
                  icon={<GoPerson />}
                  value={family_name}
                  onChange={(e) => setFamilyName(e.target.value)}
                  error={familyNameError !== ""}
                  autoComplete="off"
                />
                <Inputfield
                  type="text"
                  placeholder="نام کاربری"
                  icon={<GoPerson />}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  error={usernameError !== ""}
                  autoComplete="off"
                />
                <Inputfield
                  type="email"
                  placeholder="آدرس ایمیل"
                  icon={<HiOutlineMail />}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={emailError !== ""}
                  autoComplete="off"

                />
                <Inputfield
                  type={showPassword ? "password" : "text"}
                  placeholder="رمز عبور"
                  icon={
                    showPassword ? (
                      <FaRegEyeSlash onClick={handleIconClick} />
                    ) : (
                      <FaRegEye onClick={handleIconClick} />
                    )
                  }
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error = {passwordError !== ""}
                  autoComplete="off"

                />
                <Inputfield
                  type={showPassword ? "password" : "text"}
                  placeholder="تکرار رمز عبور"
                  icon={
                    showPassword ? (
                      <FaRegEyeSlash onClick={handleIconClick} />
                    ) : (
                      <FaRegEye onClick={handleIconClick} />
                    )
                  }
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  error = {passwordError !== ""}
                />
              </div>
              {error && <p className="error-message error-container-div">{error}</p>}
              <div className="mentee-signup-page-buttons">
                <button
                  type="submit"
                  className="mentee-signup-button"
                  disabled={isSubmitting}
                >
                  ایجاد حساب کاربری
                </button>
              </div>
            </div>
          </form>
          <div className="mentor-signup-link">
            <p>
              آیا می‌خواهید به عنوان منتور ثبت نام کنید؟{" "}
              <Link to="/mentor/signup">ثبت نام به عنوان منتور</Link>
            </p>
          </div>
        </div>
        <img className="login-page-image" src={Loginimage} alt="login-page" />
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-page-content">
        <div className="login-page-title">
          <h1 className="login-page-title-title">ثبت نام به عنوان منتی</h1>
        </div>
        <div className="step-bar-container-mentee">
          <div className="step-bar-mentee">
            <FaRegCheckCircle color="#4D7C0F" size={"1.5rem"} />
            <div className="step-line-mentee green-bg"></div>
            <FaRegCheckCircle color="#4D7C0F" size={"1.5rem"} />
          </div>
        </div>
        <div className="login-page-input-buttons">
          <div className="login-page-inputs">
            <p>ثبت نام شما با موفقیت انجام شد </p>
            <p>لطفا ایمیل خود را چک کنید</p>
          </div>
        </div>
        <div className="mentor-signup-link">
          <p>
            آیا می‌خواهید به عنوان منتور ثبت نام کنید؟{" "}
            <Link to="/mentor/signup">ثبت نام به عنوان منتور</Link>
          </p>
        </div>
      </div>
      <img className="login-page-image" src={Loginimage} alt="login-page" />
    </div>
  );
}

export default MenteeSignup;
