import React, { useState, useEffect } from 'react';
import axios from 'axios';
import editImageIcon from "../../../../../assets/Edit.svg";
import defaultProfileImage from "../../../../../assets/images/empty_profile.webp";
import config from '../../../../../config';
import "./MentorSideBarMenu.css";
import MentorSideBarItem from "../MentorSideBarItem/MentorSideBarItem";
import { IoExitOutline } from "react-icons/io5";

function MentorSideBarMenu({ onItemSelect, items }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [profileImage, setProfileImage] = useState(defaultProfileImage);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchMentorInfo();
  }, []);

  const fetchMentorInfo = async () => {
    try {
      const response = await axios.get(`${config.path}/mentor/info`, {
        withCredentials: true,
      });

      const mentorInfo = response.data;
      setUserName(`${mentorInfo.name} ${mentorInfo.family_name}`);
      setUserEmail(mentorInfo.email);

      if (mentorInfo.profile_image) {
        setProfileImage(`${config.path}/${mentorInfo.profile_image}?t=${new Date().getTime()}`);
      }
    } catch (error) {
      console.error("Error fetching mentor info", error);
      setProfileImage(defaultProfileImage);
    }
  };

  const handleClick = (index) => {
    setActiveIndex(index);
    onItemSelect(index);
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${config.path}/logout`, {}, {
        withCredentials: true,
      });
      window.location.href = "/login";
    } catch (error) {
      console.error("Error logging out", error);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
      await handleImageUpload(file);
    }
  };

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);

    try {
      const uploadResponse = await axios.post(`${config.path}/mentor/profile_image`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log("Image uploaded successfully:", uploadResponse.data);

      await fetchMentorInfo(); 
    } catch (error) {
      console.error("Error uploading profile image", error);
      alert("خطا در آپلود تصویر پروفایل");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className='mentor-sb-menu-container'>
      <div className='mentor-sb-menu-information'>
        <div className='mentor-sb-menu-information-img-holder'>
          <img
            className='mentor-sb-menu-profile-image'
            src={profileImage}
            alt="Profile"
          />
          <input
            type="file"
            accept="image/*"
            id="fileInput"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <button
            className='mentor-sb-menu-edit-icon'
            onClick={() => document.getElementById('fileInput').click()}
          >
            <img src={editImageIcon} alt="Edit Icon" />
          </button>
        </div>
        <div className='mentor-sb-menu-information-name'>
          {userName || "در حال بارگذاری..."}
        </div>
        <div className='mentor-sb-menu-information-email'>
          {userEmail || "در حال بارگذاری..."}
        </div>
      </div>
      <ul className="mentor-sb-menu-item-list">
        {items.map((item, index) => (
          <li
            key={index}
            className={activeIndex === index ? 'active' : ''}
            onClick={() => handleClick(index)}
          >
            <MentorSideBarItem text={item.text} icon={item.icon} />
          </li>
        ))}
      </ul>
      <button className='mentor-sb-menu-exit' onClick={handleLogout}>
        <IoExitOutline className='mentor-sb-menu-exit-icon' />
      </button>
      {uploading && <div>در حال آپلود تصویر...</div>}
    </div>
  );
}

export default MentorSideBarMenu;
