import React, { useState } from 'react';
import './mentorDashboard.css';
import MentorSideBarMenu from './MentorSideBar/MentorSideBarMenu/MentorSideBarMenu.jsx';
import MyMentees from "./Mymentees/Mymentees.jsx"
import GuidSec from "./GuideSec/GuidSec.jsx";
import ChangePassword from './changePassword/ChangePassword'
import FinancialTransactions from './FinancialTransactions/Financialtransactions'
import FormComponent from './FormComponent/CourseInfos.jsx';
import MentorInformation from './Components/MentorInformation/MentorInformation.jsx';
import MentorManagePlans from './Components/MentorManagePlans/MentorManagePlans.js';
import MentorDashboardPlans from './Components/MentorPlans/MentorPlans.jsx';
import MentorManageSessions from './Components/MentorManageSessions/MentorManageSessions.js';
import MentorManageRequests from './Components/MentorManageRequests/MentorManageRequests.js';
import { FaRegUser } from "react-icons/fa";
import { TfiAgenda } from "react-icons/tfi";
import { TfiCalendar } from "react-icons/tfi";
import { MdOutlinePayment } from "react-icons/md";
import { IoChatboxOutline } from "react-icons/io5";
import MentorSession from './Components/MentorSessions/MentorSessions.jsx';

const MentorDashboard = () => {

  const items = [
    { text: " اطلاعات کاربری ",
      icon: <FaRegUser/>
     },
     { text: "مدیریت پلن ها",
      icon: <TfiAgenda/>
     },
    { text: "دوره ها",
      icon: <TfiAgenda/>
     },
     { text: "مدیریت جلسات",
      icon: <TfiCalendar/>
     },
    { text: "جلسات من",
      icon: <TfiCalendar/>
     },
     { text: "مدیریت درخواست ها",
      icon: <TfiCalendar/>
     },
    { text: "  پرداخت ها " ,
      icon: <MdOutlinePayment/>
     },
    { text: "پیام رسان ",
      icon: <IoChatboxOutline/>
      },
    
  ];

  const [selectedItem, setSelectedItem] = useState(0);

  const handleItemSelect = (index) => {
    setSelectedItem(index);
  };

  const renderContent = () => {
    switch (selectedItem) {
      case 0:
        return <MentorInformation />;
      case 1:
        return <MentorManagePlans />
      case 2:
        return <MentorDashboardPlans />
      case 3:
        return <MentorManageSessions />
      case 4:
        return <MentorSession />;
      case 5:
        return <MentorManageRequests />
      case 6:
        return <FinancialTransactions />;
      default:
        return <MentorInformation />;
    }
  };

  return (
    <div className='dash-board-container'>
      <div className='side-bar'>
        <MentorSideBarMenu items={items} onItemSelect={handleItemSelect} />
      </div>
      <div className='dash-board-content-container'>
        <div className='dash-board-inputs-container'>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default MentorDashboard;
