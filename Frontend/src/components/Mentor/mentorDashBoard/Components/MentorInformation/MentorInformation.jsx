import React, { useState, useEffect } from 'react';
import InputLabel from "../../InputLabel/InputLabel";
import './MentorInformation.css';
import Button from '../../../../Components/Button/Button';
import ChangePassword from '../../changePassword/ChangePassword';
import axios from 'axios';
import config from '../../../../../config';

function MentorInformation() {
  const [mentorData, setMentorData] = useState({
    name: '',
    family_name: '',
    email: '',
    phone_number: '',
    degree: '',
    university: '',
    field_of_study: '',
    city: '',
    country: '',
    cv_file: '',
    bio: '',
    skills: [],
  });

  const [initialData, setInitialData] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [skillTypes, setSkillTypes] = useState([]);
  const [isSkillsDropdownOpen, setIsSkillsDropdownOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  useEffect(() => {
    const fetchMentorInfo = async () => {
      try {
        const response = await axios.get(`${config.path}/mentor/info`, { withCredentials: true });
        const fetchedData = response.data;

        setMentorData({
          ...fetchedData,
          skills: fetchedData.skills.map(skill => skill.id.toString()), // Store IDs for updating later
        });

        setInitialData({
          ...fetchedData,
          skills: fetchedData.skills.map(skill => skill.id.toString()),
        });
      } catch (error) {
        setError('مشکلی در بارگذاری اطلاعات وجود دارد.');
      }
    };

    const fetchSkillTypes = async () => {
      try {
        const response = await axios.get(`${config.path}/skills`, { withCredentials: true });
        setSkillTypes(response.data);
      } catch (error) {
        setError('مشکلی در بارگذاری مهارت‌ها وجود دارد.');
      }
    };

    fetchMentorInfo();
    fetchSkillTypes();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setMentorData((prevData) => ({ ...prevData, [id]: value }));
    setError('');
    setSuccess('');
  };

  const handleSkillSelection = (skillId) => {
    const isSelected = mentorData.skills.includes(skillId);
    const updatedSkills = isSelected
      ? mentorData.skills.filter(id => id !== skillId)
      : [...mentorData.skills, skillId];

    setMentorData((prevData) => ({ ...prevData, skills: updatedSkills }));
  };

  const toggleSkillsDropdown = () => {
    setIsSkillsDropdownOpen(!isSkillsDropdownOpen);
  };

  const handleSubmit = async () => {
    if (JSON.stringify(mentorData) === JSON.stringify(initialData)) {
      setError('تغییری برای اعمال وجود ندارد');
      return;
    }

    try {
      await axios.put(
        `${config.path}/mentor/info`,
        {
          ...mentorData,
          skills: mentorData.skills.map(skill => parseInt(skill)), // Ensure IDs are sent as integers
        },
        { withCredentials: true }
      );
      setSuccess('تغییرات با موفقیت ذخیره شدند!');
      setInitialData(mentorData);
    } catch (error) {
      setError('خطا در ذخیره تغییرات.');
    }
  };

  return (
    <div className='mentorinfo-page'>
      <h2>اطلاعات کاربری</h2>
      <div className='mentorinfo-inner-container'>
        <InputLabel label="نام" type="text" id="name" value={mentorData.name} onChange={handleChange} />
        <InputLabel label="نام خانوادگی" type="text" id="family_name" value={mentorData.family_name} onChange={handleChange} />
        <InputLabel label="ایمیل" type="email" id="email" value={mentorData.email} onChange={handleChange} disabled />
        <InputLabel label="شهر" type="text" id="city" value={mentorData.city} onChange={handleChange} />
        <InputLabel label="کشور" type="text" id="country" value={mentorData.country} onChange={handleChange} />
        <InputLabel label="شماره تلفن" type="text" id="phone_number" value={mentorData.phone_number} onChange={handleChange} />
        <InputLabel label="رشته تحصیلی" type="text" id="field_of_study" value={mentorData.field_of_study} onChange={handleChange} />
        <InputLabel label="دانشگاه" type="text" id="university" value={mentorData.university} onChange={handleChange} />

        <div className='mentorinfo-inputs-skills'>
          <label className="input-label">مهارت‌ها</label>
          <div className="mentor-dashboard-select-multi-select" onClick={toggleSkillsDropdown}>
            <div className="mentor-dashboard-select-multi-select-label">
              {mentorData.skills.length > 0
                ? mentorData.skills
                    .map(skillId => skillTypes.find(skill => skill.id.toString() === skillId)?.name || '')
                    .filter(name => name)
                    .join(', ')
                : 'انتخاب مهارت‌ها'}
            </div>
            {isSkillsDropdownOpen && (
              <div className="mentor-dashboard-select-multi-select-dropdown">
                {skillTypes.map(skill => (
                  <label key={skill.id} className="mentor-dashboard-select-multi-select-option">
                    <input
                      type="checkbox"
                      value={skill.id.toString()}
                      checked={mentorData.skills.includes(skill.id.toString())}
                      onChange={() => handleSkillSelection(skill.id.toString())}
                    />
                    {skill.name}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className='mentorinfo-goal-container'>
          <div className="mentorinfo-goal-label">درباره</div>
          <textarea
            className='mentorinfo-goal-input'
            id="bio"
            placeholder="درباره خود را وارد کنید"
            value={mentorData.bio}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className='mentorinfo-goal-button-container'>
        <Button text="تغییر رمز" buttonstyle="change-password-button" onClick={() => setIsChangePasswordOpen(true)} />
        <Button text="ذخیره" onClick={handleSubmit} buttonstyle="primary-buttonn" />
      </div>

      {isChangePasswordOpen && (
        <div className='mentorinfo-popup-overlay'>
          <div className='mentorinfo-popup-content'>
            <button className="mentorinfo-close-popup-button" onClick={() => setIsChangePasswordOpen(false)}>×</button>
            <ChangePassword />
          </div>
        </div>
      )}

      {error && <p className="change-password-error-message">{error}</p>}
      {success && <div className="success-message">{success}</div>}
    </div>
  );
}

export default MentorInformation;
