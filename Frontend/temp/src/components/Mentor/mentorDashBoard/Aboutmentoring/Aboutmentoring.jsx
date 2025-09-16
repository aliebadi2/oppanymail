// import React from "react";
// import Dinput from "../Dash-input/Dinput";
// import Dinput2 from "../Dash-input-2/Dinput2";
// import './Aboutmentoring.css';
// import ToggleButton from "../toggle/Toggle";

// function Aboutmentoring() {
//   return (
//     <div className="about-mentoring-contents">
//       <div className="mentoring-details">
//           <div className="mentoring-details-with-title">
//           <p className="mentoring-details-title">دوره منتورینگ مدیر محصول شما توسط منتورشیپ تایید شده است.</p>
//         <div className="mentoring-details-inputs">
//           <div className="mentoring-details-inputs-right">
//             <div className="mentoring-input">
//               <p>مدت زمان دمو را وارد کنید</p>
//               <Dinput2 />
//             </div>
//             <div className="mentoring-input">
//               <p>قیمت ماهیانه را وارد کنید</p>
//               <Dinput2 />
//             </div>
//             <div className="mentoring-input">
//               <p>شماره شبا را وارد کنید</p>
//               <Dinput2 />
//             </div>
//             <div className="mentoring-input">
//               <p>ساعت وبینار در ماه را وارد کنید</p>
//               <Dinput2 />
//             </div>
//             <div className="mentoring-input">
//               <p>لینکدین خود را وارد کنید</p>
//               <Dinput2 />
//             </div>
//           </div>
//           <div className="mentoring-details-inputs-left">
//             <div className="mentoring-input">
//               <p>سابقه کاری خود را وارد کنید</p>
//               <Dinput2 />
//             </div>
//             <div className="mentoring-toggle">
//               <p>قابلیت چت با کارآموز</p>
//               <ToggleButton />
//             </div>
//             <div className="mentoring-toggle">
//               <p>دموی رایگان</p>
//               <ToggleButton />
//             </div>
//             <div className="mentoring-toggle">
//               <p>وبینار هفتگی</p>
//               <ToggleButton />
//             </div>
//             <div className="mentoring-toggle">
//               <p>تسک محور</p>
//               <ToggleButton />
//             </div>
//           </div>
//         </div>
//           </div>
//           <div className="mentoring-company-inputs">
//             <p>تصویر خود را وارد کنید</p>
//             <div class="sb-menu-information-img-holder"><button class="sb-menu-edit-icon"><img src="/static/media/Edit.3ebe17ce886dc59a400cb1661d2de478.svg" alt=""></img></button></div>
//             <div className="mentoring-input">
//               <p>شرکت خود را وارد کنید</p>
//               <Dinput2 />
//             </div>
//             <div className="mentoring-input">
//               <p>عنوان شغلی فعلی خود را وارد کنید</p>
//               <Dinput2 />
//             </div>
//             <div className="mentoring-input">
//               <p>مهارت های خود را وارد کنید</p>
//               <Dinput2 />
//             </div>
//           </div>
//       </div>
//     </div>
//   );
// }

// export default Aboutmentoring;


import React, { useState } from "react";
import Dinput2 from "../Dash-input-2/Dinput2";
import './Aboutmentoring.css';
import ToggleButton from "../toggle/Toggle";

function Aboutmentoring() {
  const [demoDuration, setDemoDuration] = useState('');
  const [monthlyPrice, setMonthlyPrice] = useState('');
  const [shabaNumber, setShabaNumber] = useState('');
  const [webinarHours, setWebinarHours] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [experience, setExperience] = useState('');
  const [chatCapability, setChatCapability] = useState(false);
  const [freeDemo, setFreeDemo] = useState(false);
  const [weeklyWebinar, setWeeklyWebinar] = useState(false);
  const [taskOriented, setTaskOriented] = useState(false);
  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (index) => {
    const newSkills = skills.filter((_, i) => i !== index);
    setSkills(newSkills);
  };

  return (
    <div className="about-mentoring-contents">
      <div className="mentoring-details">
        <div className="mentoring-details-with-title">
          <p className="mentoring-details-title">دوره منتورینگ مدیر محصول شما توسط منتورشیپ تایید شده است.</p>
          <div className="mentoring-details-inputs">
            <div className="mentoring-details-inputs-right">
              <div className="mentoring-input">
                <p>مدت زمان دمو را وارد کنید</p>
                <Dinput2 value={demoDuration} onChange={(e) => setDemoDuration(e.target.value)} />
              </div>
              <div className="mentoring-input">
                <p>قیمت ماهیانه را وارد کنید</p>
                <Dinput2 value={monthlyPrice} onChange={(e) => setMonthlyPrice(e.target.value)} />
              </div>
              <div className="mentoring-input">
                <p>شماره شبا را وارد کنید</p>
                <Dinput2 value={shabaNumber} onChange={(e) => setShabaNumber(e.target.value)} />
              </div>
              <div className="mentoring-input">
                <p>ساعت وبینار در ماه را وارد کنید</p>
                <Dinput2 value={webinarHours} onChange={(e) => setWebinarHours(e.target.value)} />
              </div>
              <div className="mentoring-input">
                <p>لینکدین خود را وارد کنید</p>
                <Dinput2 value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
              </div>
            </div>
            <div className="mentoring-details-inputs-left">
              <div className="mentoring-input">
                <p>سابقه کاری خود را وارد کنید</p>
                <Dinput2 value={experience} onChange={(e) => setExperience(e.target.value)} />
              </div>
              <div className="mentoring-toggle">
                <p>قابلیت چت با کارآموز</p>
                <ToggleButton checked={chatCapability} onChange={() => setChatCapability(!chatCapability)} />
              </div>
              <div className="mentoring-toggle">
                <p>دموی رایگان</p>
                <ToggleButton checked={freeDemo} onChange={() => setFreeDemo(!freeDemo)} />
              </div>
              <div className="mentoring-toggle">
                <p>وبینار هفتگی</p>
                <ToggleButton checked={weeklyWebinar} onChange={() => setWeeklyWebinar(!weeklyWebinar)} />
              </div>
              <div className="mentoring-toggle">
                <p>تسک محور</p>
                <ToggleButton checked={taskOriented} onChange={() => setTaskOriented(!taskOriented)} />
              </div>
            </div>
          </div>
        </div>
        <div className="mentoring-company-inputs">
          <p>تصویر خود را وارد کنید</p>
          <div className="sb-menu-information-img-holder">
            <button className="sb-menu-edit-icon">
              <img src="/static/media/Edit.3ebe17ce886dc59a400cb1661d2de478.svg" alt="edit" />
            </button>
          </div>
          <div className="mentoring-input">
            <p>شرکت خود را وارد کنید</p>
            <Dinput2 value={company} onChange={(e) => setCompany(e.target.value)} placeholder="نام شرکت" />
          </div>
          <div className="mentoring-input">
            <p>عنوان شغلی فعلی خود را وارد کنید</p>
            <Dinput2 value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="مدیر محصول"/>
          </div>
          <div className="mentoring-input">
            <p>مهارت های خود را وارد کنید</p>
            <div className="skill-input-container">
              <input
              className="skill-input"
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="مهارت جدید"
              />
              <button className="skill-button" type="button" onClick={handleAddSkill}>افزودن</button>
            </div>
            <div className="skills-list">
              {skills.map((skill, index) => (
                <div key={index} className="skill-item">
                  <span>{skill}</span>
                  <button type="button" onClick={() => handleRemoveSkill(index)}>x</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Aboutmentoring;
