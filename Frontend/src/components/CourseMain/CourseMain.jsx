import React, { useState } from 'react';
import './CourseMain.css';
import InfItem from '../Components/InfItem/InfItem';
import userIcon from '../../assets/Off1.svg';
import mentoringUser from '../../assets/Mentoring User.svg';
import dollorIcon from '../../assets/Dollar.svg';
import calenderIcon from '../../assets/Calendar.svg'
import MenuItem from './menuItem/MenuItem';
import Tracker from './tracker/Tracker';
import Projects from './projects/Projects';
import Webinars from './webinars/Webinars';
import Files from './files/Files';
import Videos from './videos/VideoTable'
import icon1 from '../../assets/Path for Intern Progress.svg';
import icon2 from '../../assets/Document.svg'
import icon3 from '../../assets/Message-5.svg'
import icon4 from '../../assets/Camera.svg'
import icon5 from '../../assets/Video.svg'
import icon6 from '../../assets/Message - 2.svg'



import { useEffect } from 'react';
const CourseMain = () => {
  const[courseData, setCourseData] = useState(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await fetch('/mentorCourseData.json'); // Ensure the JSON file is accessible
        const data = await response.json();
        setCourseData(data);
      } catch (error) {
        console.error('Error fetching course data:', error);
      }
    };

    fetchCourseData();
  }, []);
  // State to track the selected menu item
  const [selectedItem, setSelectedItem] = useState("item1");

  // Handler to update the selected menu item
  const handleMenuItemClick = (itemName) => {
    setSelectedItem(itemName);
  };

  const renderContent = () => {
    switch (selectedItem) {
      case "item1":
        return <Tracker milestones={courseData.listOfMilestones} nowLevel={courseData.nowLevel}   />;
      case "item2":
        return <Projects projects={courseData.listOfProjects} />;
      case "item3":
        return <p>اینجا بخش پیام ها خواهد بود.</p>; // Placeholder for Messages
      case "item4":
        return <Webinars webinars={courseData.listOfWebinars} />;
      case "item5":
        return <Videos videos={courseData.listOfVideos}/>;
      case "item6":
        return <Files files={courseData.listOfFiles} />;
      default:
        return <p>لطفاً یک گزینه را انتخاب کنید.</p>;
    }
  };

  if (!courseData) {
    // Show a loading message until courseData is loaded
    return <p>در حال بارگذاری داده‌ها...</p>;
  }

  return (
    <div className='c-m-page'>
      <div className='c-m-information-container'>
        <InfItem
          icon={userIcon}
          title={"منتور:"}
          information={courseData.mentorName}
        />
        <InfItem
          icon={mentoringUser}
          title={"منتورشیپ:"}
          information={courseData.menteeName}
        />
        <InfItem
          icon={calenderIcon}
          title={"تاریخ شروع:"}
          information={courseData.startDate}
        />
        <InfItem
          icon={dollorIcon}
          title={"مبلغ پرداخت شده:"}
          information={courseData.paymentAmount}
        />
      </div>
      
      <div className='c-m-duration-date'>
        <div className='c-m-duration'>
          <div className='c-m-duration-title'>
            زمان باقیمانده دمو:
          </div>
          <div className='c-m-duration-inf'>
            {courseData.timeLeft}
          </div>
        </div>
        <div className='c-m-duration'>
          <div className='c-m-duration-title'>
            تاریخ پایان دوره:
          </div>
          <div className='c-m-duration-inf'>
            {courseData.dateOfEnd}
          </div>
        </div>
      </div>
      
      <div className='c-m-navbar'>
        <MenuItem
          icon={icon1}
          title={"مسیر پیشرفت کارآموز"}
          isSelected={selectedItem === "item1"}
          onClick={() => handleMenuItemClick("item1")}
        />
        <MenuItem
          icon={icon2}
          title={" پروژه ها  "}
          isSelected={selectedItem === "item2"}
          onClick={() => handleMenuItemClick("item2")}
        />
      
      
        <MenuItem
          icon={icon3}
          title={"پیام ها  "}
          isSelected={selectedItem === "item3"}
          onClick={() => handleMenuItemClick("item3")}
        />
        <MenuItem
          icon={icon4}
          title={"وبینارها"}
          isSelected={selectedItem === "item4"}
          onClick={() => handleMenuItemClick("item4")}
        />
        
        <MenuItem
          icon={icon5}
          title={"ویدیوها   "}
          isSelected={selectedItem === "item5"}
          onClick={() => handleMenuItemClick("item5")}
        />
        <MenuItem
          icon={icon6}
          title={"فایل ها   "}
          isSelected={selectedItem === "item6"}
          onClick={() => handleMenuItemClick("item6")}
        />
      </div>
      {renderContent()}


      
    </div>
  );
};

export default CourseMain;
