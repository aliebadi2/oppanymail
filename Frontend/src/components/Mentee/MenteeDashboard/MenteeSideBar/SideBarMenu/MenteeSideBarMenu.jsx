import React, { useState, useEffect } from 'react';
import axios from 'axios';
import editImageIcon from "../../../../../assets/Edit.svg";
import defaultProfileImage from "../../../../../assets/images/empty_profile.webp";
import config from '../../../../../config';
import "./MenteeSideBarMenu.css";
import MenteeSideBarItem from "../SideBarItem/MenteeSideBarItem";
import { IoExitOutline } from "react-icons/io5";

function MenteeSideBarMenu({ onItemSelect, items }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [profileImage, setProfileImage] = useState(defaultProfileImage);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchMenteeInfo = async () => {
      try {
        const response = await axios.get(`${config.path}/mentee/info`, {
          withCredentials: true,
        });

        setUserName(`${response.data.name} ${response.data.family_name}`);
        setUserEmail(response.data.email);

        if (response.data.profile_image) {
          setProfileImage(`${config.path}/${response.data.profile_image}`);
        }
      } catch (error) {
        console.error("Error fetching mentee info", error);
        setProfileImage(defaultProfileImage);
      }
    };

    fetchMenteeInfo();
  }, []);

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
      await axios.post(`${config.path}/mentee/profile_image`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert("تصویر پروفایل با موفقیت آپلود شد!");
      
      // Refresh mentee info to display updated profile image
      const response = await axios.get(`${config.path}/mentee/info`, {
        withCredentials: true,
      });

      if (response.data.profile_image) {
        setProfileImage(`${config.path}/${response.data.profile_image}`);
      }
    } catch (error) {
      console.error("Error uploading image", error);
      alert("خطا در آپلود تصویر پروفایل");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className='mentee-dashboard-sb-menu-container'>
      <div className='mentee-dashboard-sb-menu-information'>
        <div className='mentee-dashboard-sb-menu-information-img-holder'>
          <img
            className='mentee-dashboard-sb-menu-profile-image'
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
            className='mentee-dashboard-sb-menu-edit-icon'
            onClick={() => document.getElementById('fileInput').click()}
          >
            <img src={editImageIcon} alt="Edit Icon" />
          </button>
        </div>
        <div className='mentee-dashboard-sb-menu-information-name'>
          {userName || "در حال بارگذاری..."}
        </div>
        <div className='mentee-dashboard-sb-menu-information-email'>
          {userEmail || "در حال بارگذاری..."}
        </div>
      </div>
      <ul className="mentee-dashboard-sb-menu-item-list">
        {items.map((item, index) => (
          <li
            key={index}
            className={activeIndex === index ? 'active' : ''}
            onClick={() => handleClick(index)}
          >
            <MenteeSideBarItem text={item.text} icon={item.icon} />
          </li>
        ))}
      </ul>
      <button className='mentee-dashboard-sb-menu-exit' onClick={handleLogout}>
        <IoExitOutline className='mentee-dashboard-sb-menu-exit-icon'/>
      </button>
      {uploading && <div>در حال آپلود تصویر...</div>}
    </div>
  );
}

export default MenteeSideBarMenu;
