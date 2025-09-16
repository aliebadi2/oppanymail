import React, { useState, useContext } from "react";
import Inputfield from "../../Components/Input/Inputfield";
import { GoPerson } from "react-icons/go";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import axios from "axios";
import Loginimage from '../../../assets/loginImage.png';
import { useNavigate } from "react-router-dom";
import { UserContext } from '../../../UserContext'; 
import "./Loginpage.css";
import config from "../../../config";

function Loginpage() {
  const [showPassword, setShowPassword] = useState(true);
  const [username, setUsername] = useState(""); 
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { checkLoginStatus } = useContext(UserContext);

  const handleIconClick = () => {
    setShowPassword(!showPassword);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    setError("");  
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError("");  
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${config.path}/login`,
        { username, password },  
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setSuccess("Login successful!");
        setError("");

        await checkLoginStatus();

        navigate("/welcome");
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        
        if (typeof errorData.detail === "string") {
          setError(errorData.detail);
        } else if (Array.isArray(errorData.detail)) {
          setError(errorData.detail.map(err => err.msg).join(", "));
        } else {
          setError("Login failed. Please check your username and password.");
        }
      } else {
        setError("Login failed. Please check your username and password.");
      }
      setSuccess(""); 
    }
  };

  return (
    <div className="login-page">
      <div className="login-page-content">
        <div className="login-page-title">
          <h1 className="login-page-title-title">وارد شوید</h1>
          <h2 className="login-page-title-discription">برای شروع یادگیری</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="login-page-input-buttons">
            <div className="login-page-inputs">
              <Inputfield
                type="text"  
                placeholder="نام کاربری"
                icon={<GoPerson />}
                value={username}
                onChange={handleUsernameChange} 
              />
              <Inputfield
                type={showPassword ? "password" : "text"}
                placeholder="رمز عبور"
                icon={showPassword ? <FaRegEyeSlash onClick={handleIconClick} /> : <FaRegEye onClick={handleIconClick} />}
                value={password}
                onChange={handlePasswordChange}
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            <div className="login-page-buttons">
              <button type="submit" className="login-button">
                ورود  
              </button>
            </div>
          </div>
        </form>
      </div>
      <img className="login-page-image" src={Loginimage} alt="login-page" />
    </div>
  );
}

export default Loginpage;
