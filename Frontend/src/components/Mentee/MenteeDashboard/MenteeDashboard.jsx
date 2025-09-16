import React, { useState, useEffect } from 'react';
import './MenteeDashboard.css';
import axios from 'axios';
import config from '../../../config.js';
import MenteeSideBarMenu from './MenteeSideBar/SideBarMenu/MenteeSideBarMenu.jsx';
import MenteeInformation from './MenteeInfo/mentee-information.jsx';
import MenteePlans from './MenteePlans/MenteePlans.jsx';
import MenteeSession from './MenteeSessions/MenteeSessions.jsx';
import MenteeWalletAndTransactions from './MenteeWalletAndTransactions/MenteeWalletAndTransactions.js';
import MenteeCheckRequests from './MenteeCheckRequests/MenteeCheckRequests.js';

import { FaRegUser } from "react-icons/fa";
import { TfiAgenda } from "react-icons/tfi";
import { TfiCalendar } from "react-icons/tfi";
import { MdOutlinePayment } from "react-icons/md";
import { IoChatboxOutline } from "react-icons/io5";

const MenteeDashboard = () => {
  const items = [
    { text: "اطلاعات کاربری", icon: <FaRegUser /> },
    { text: "درخواست های من", icon: <TfiAgenda /> },
    { text: "دوره ها", icon: <TfiAgenda /> },
    { text: "جلسات من", icon: <TfiCalendar /> },
    { text: "پرداخت ها", icon: <MdOutlinePayment /> },
    { text: "پیام رسان", icon: <IoChatboxOutline /> },
  ];

  const [selectedItem, setSelectedItem] = useState(0);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`${config.API_BASE_URL}/me`, {
          withCredentials: true
        });
        setUserName(response.data.name);
      } catch (error) {
        console.error("Error fetching user info", error);
      }
    };
    fetchUserInfo();
  }, []);

  const handleItemSelect = (index) => {
    setSelectedItem(index);
    if (window.innerWidth <= 670) {
      toggleSidebar();
    }
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const renderContent = () => {
    switch (selectedItem) {
      case 0:
        return <MenteeInformation />;
      case 1:
        return <MenteeCheckRequests />;
      case 2:
        return <MenteePlans />;
      case 3:
        return <MenteeSession />;
      case 4:
        return <MenteeWalletAndTransactions />;
      default:
        return <MenteeInformation />;
    }
  };

  return (
    <div className='mentee-dash-board-container'>
      <div className='mentee-side-bar'>
        <MenteeSideBarMenu items={items} onItemSelect={handleItemSelect} />
      </div>
      <div className='mentee-dash-board-content-container'>
        <div className='mentee-dash-board-inputs-container'>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default MenteeDashboard;
