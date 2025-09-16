import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams for URL params
import './MentorCourse.css';
import InfItem from '../../../../Components/InfItem/InfItem';
import userIcon from '../../../../../assets/Off1.svg';
import mentoringUser from '../../../../../assets/Mentoring User.svg';
import dollorIcon from '../../../../../assets/Dollar.svg';
import calenderIcon from '../../../../../assets/Calendar.svg';
import MenuItem from '../../../../CourseMain/menuItem/MenuItem';
import VideoMentor from '../videoMentor/VideoMentor';
import MentorTracker from '../mentorTracker/MentorTracker';
import ProjectMentor from '../projectMentor/ProjectMentor';
import WebinarMentor from '../webinarMentor/WebinarMentor';
import FileMentor from '../fileMentor/FileMentor';
import axios from 'axios';
import config from '../../../../../config';

import icon1 from '../../../../../assets/Path for Intern Progress.svg';
import icon2 from '../../../../../assets/Document.svg';
import icon3 from '../../../../../assets/Message-5.svg';
import icon4 from '../../../../../assets/Camera.svg';
import icon5 from '../../../../../assets/Video.svg';
import icon6 from '../../../../../assets/Message - 2.svg';

const MentorCourse = () => {
  const { activePlanId } = useParams(); // Get activePlanId from the URL
  const [selectedItem, setSelectedItem] = useState("item1");
  const [courseData, setCourseData] = useState(null);

  const handleMenuItemClick = (itemName) => {
    setSelectedItem(itemName);
  };

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await axios.get(
          `${config.path}/mentor/courses/${activePlanId}`,
          { withCredentials: true }  
        );
        setCourseData(response.data);
      } catch (error) {
        console.error('Error fetching course data:', error);
      }
    };

    if (activePlanId) {
      fetchCourseData(); // Only fetch if activePlanId is available
    }
  }, [activePlanId]);

  const renderContent = () => {
    if (!courseData) {
      return <p>در حال بارگذاری داده‌ها...</p>;
    }

    switch (selectedItem) {
      case "item1":
        return <MentorTracker trackers={courseData.listOfMilestones} />;
      case "item2":
        return <ProjectMentor projects={courseData.listOfProjects} />;
      case "item3":
        return <p>اینجا بخش پیام‌ها خواهد بود.</p>; // Placeholder for Messages
      case "item4":
        return <WebinarMentor webinars={courseData.listOfWebinars} />;
      case "item5":
        return <VideoMentor videos={courseData.listOfVideos} />;
      case "item6":
        return <FileMentor files={courseData.listOfFiles} />;
      default:
        return <p>لطفاً یک گزینه را انتخاب کنید.</p>;
    }
  };

  if (!courseData) {
    return <p>در حال بارگذاری داده‌ها...</p>;
  }

  return (
    <div className="c-m-page">
      <div className="c-m-information-container">
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

      <div className="c-m-duration-date">
        <div className="c-m-duration">
          <div className="c-m-duration-title">زمان باقیمانده دمو:</div>
          <div className="c-m-duration-inf">{courseData.timeLeft}</div>
        </div>
        <div className="c-m-duration">
          <div className="c-m-duration-title">تاریخ پایان دوره:</div>
          <div className="c-m-duration-inf">{courseData.dateOfEnd}</div>
        </div>
      </div>

      <div className="c-m-navbar">
        <MenuItem
          icon={icon1}
          title={"مسیر پیشرفت کارآموز"}
          isSelected={selectedItem === "item1"}
          onClick={() => handleMenuItemClick("item1")}
        />
        <MenuItem
          icon={icon2}
          title={"پروژه‌ها"}
          isSelected={selectedItem === "item2"}
          onClick={() => handleMenuItemClick("item2")}
        />
        <MenuItem
          icon={icon3}
          title={"پیام‌ها"}
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
          title={"ویدیوها"}
          isSelected={selectedItem === "item5"}
          onClick={() => handleMenuItemClick("item5")}
        />
        <MenuItem
          icon={icon6}
          title={"فایل‌ها"}
          isSelected={selectedItem === "item6"}
          onClick={() => handleMenuItemClick("item6")}
        />
      </div>
      {renderContent()}
    </div>
  );
};

export default MentorCourse;
