import React, { useState, useEffect } from 'react';
import './CourseInfos.css'; // Update CSS file import name
import axios from 'axios';
import config from '../../../../config';

const CourseInfos = () => {
  const [formState, setFormState] = useState({
    standard: {
      course_name: '',
      course_price: '',
      course_call_time: '',
      course_time_in_month: '',
      course_explain: ''
    },
    professional: {
      course_name: '',
      course_price: '',
      course_call_time: '',
      course_time_in_month: '',
      course_explain: ''
    }
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [placeholders, setPlaceholders] = useState({
    standard: {},
    professional: {},
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${config.path}/mentor/courses`, {
          withCredentials: true,
        });

        const { basic, advance } = response.data;

        if (basic) {
          setFormState((prevState) => ({
            ...prevState,
            standard: {
              course_name: basic.title || '',
              course_price: basic.price || '',
              course_call_time: basic.session_time || '',
              course_time_in_month: basic.session_number || '',
              course_explain: basic.explain || ''
            }
          }));
          setPlaceholders((prevPlaceholders) => ({
            ...prevPlaceholders,
            standard: {
              course_name: basic.title || 'نام دوره',
              course_price: basic.price || 'تومان',
              course_call_time: basic.session_time || 'دقیقه',
              course_time_in_month: basic.session_number || 'تعداد',
              course_explain: basic.explain || 'توضیحات'
            }
          }));
        }

        if (advance) {
          setFormState((prevState) => ({
            ...prevState,
            professional: {
              course_name: advance.title || '',
              course_price: advance.price || '',
              course_call_time: advance.session_time || '',
              course_time_in_month: advance.session_number || '',
              course_explain: advance.explain || ''
            }
          }));
          setPlaceholders((prevPlaceholders) => ({
            ...prevPlaceholders,
            professional: {
              course_name: advance.title || 'نام دوره',
              course_price: advance.price || 'تومان',
              course_call_time: advance.session_time || 'دقیقه',
              course_time_in_month: advance.session_number || 'تعداد',
              course_explain: advance.explain || 'توضیحات'
            }
          }));
        }

        setLoading(false);
      } catch (error) {
        setError('Failed to load course information');
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleChange = (e, courseType) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [courseType]: {
        ...prevState[courseType],
        [name]: value,
      }
    }));
  };

  const handleSubmit = async (courseType) => {
  const dataToSend = {
    course_type: courseType === 'standard' ? 'basic' : 'advance',
    title: formState[courseType].course_name || "No title",
    price: formState[courseType].course_price ? parseInt(formState[courseType].course_price) : 0,
    session_time: formState[courseType].course_call_time ? parseInt(formState[courseType].course_call_time) : 0,
    session_number: formState[courseType].course_time_in_month ? parseInt(formState[courseType].course_time_in_month) : 0,
    explain: formState[courseType].course_explain || "No explanation",
  };

  console.log("Sending data:", dataToSend);  // Log data for debugging

  try {
    await axios.put(`${config.path}/mentor/courses`, dataToSend, {
      withCredentials: true, // Assuming JWT is required
    });

    alert(`${courseType === 'standard' ? 'Standard' : 'Professional'} course saved successfully!`);
  } catch (error) {
    console.error('Error sending form data', error);
    alert('Error saving course.');
  }
};

  if (loading) {
    return <div>Loading course information...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="CourseInfos-container">
      {/* Standard Course Form */}
      <div className="CourseInfos-section">
        <div className='CourseInfos-header-container'>
          <h1 className='CourseInfos-header'>دوره ی استاندارد</h1>
        </div>
        <div className='CourseInfos-inner-container'>
          <div className="CourseInfos-group">
            <label>نام دوره را وارد کنید</label>
            <input
              type="text"
              name="course_name"
              value={formState.standard.course_name}
              onChange={(e) => handleChange(e, 'standard')}
              placeholder={placeholders.standard.course_name || "نام دوره"}
            />
          </div>

          <div className="CourseInfos-group">
            <label>قیمت را وارد کنید</label>
            <input
              type="text"
              name="course_price"
              value={formState.standard.course_price}
              onChange={(e) => handleChange(e, 'standard')}
              placeholder={placeholders.standard.course_price || "تومان"}
            />
          </div>

          <div className="CourseInfos-group">
            <label>مدت زمان هر تماس</label>
            <input
              type="text"
              name="course_call_time"
              value={formState.standard.course_call_time}
              onChange={(e) => handleChange(e, 'standard')}
              placeholder={placeholders.standard.course_call_time || "دقیقه"}
            />
          </div>

          <div className="CourseInfos-group">
            <label>تعداد جلسات در ماه</label>
            <input
              type="text"
              name="course_time_in_month"
              value={formState.standard.course_time_in_month}
              onChange={(e) => handleChange(e, 'standard')}
              placeholder={placeholders.standard.course_time_in_month || "تعداد"}
            />
          </div>
        </div>

        <div className='CourseInfos-inner-container2'>
          <label>توضیحات خود را وارد کنید</label>
          <textarea
            name="course_explain"
            value={formState.standard.course_explain}
            onChange={(e) => handleChange(e, 'standard')}
            placeholder={placeholders.standard.course_explain || 'توضیحات'}
            className='CourseInfos-inner-container-explain'
          />
        </div>

        <div className='CourseInfos-inner-container-input-container'>
          <button className='CourseInfos-inner-container-input' onClick={() => handleSubmit('standard')}>
            ذخیره
          </button>
        </div>
      </div>

      {/* Professional Course Form */}
      <div className="CourseInfos-section">
        <div className='CourseInfos-header-container'>
          <h1 className='CourseInfos-header'>دوره ی حرفه ای</h1>
        </div>
        <div className='CourseInfos-inner-container'>
          <div className="CourseInfos-group">
            <label>نام دوره را وارد کنید</label>
            <input
              type="text"
              name="course_name"
              value={formState.professional.course_name}
              onChange={(e) => handleChange(e, 'professional')}
              placeholder={placeholders.professional.course_name || "نام دوره"}
            />
          </div>

          <div className="CourseInfos-group">
            <label>قیمت را وارد کنید</label>
            <input
              type="text"
              name="course_price"
              value={formState.professional.course_price}
              onChange={(e) => handleChange(e, 'professional')}
              placeholder={placeholders.professional.course_price || "تومان"}
            />
          </div>

          <div className="CourseInfos-group">
            <label>مدت زمان هر تماس</label>
            <input
              type="text"
              name="course_call_time"
              value={formState.professional.course_call_time}
              onChange={(e) => handleChange(e, 'professional')}
              placeholder={placeholders.professional.course_call_time || "دقیقه"}
            />
          </div>

          <div className="CourseInfos-group">
            <label>تعداد جلسات در ماه</label>
            <input
              type="text"
              name="course_time_in_month"
              value={formState.professional.course_time_in_month}
              onChange={(e) => handleChange(e, 'professional')}
              placeholder={placeholders.professional.course_time_in_month || "تعداد"}
            />
          </div>
        </div>

        <div className='CourseInfos-inner-container2'>
          <label>توضیحات خود را وارد کنید</label>
          <textarea
            name="course_explain"
            value={formState.professional.course_explain}
            onChange={(e) => handleChange(e, 'professional')}
            placeholder={placeholders.professional.course_explain || 'توضیحات'}
            className='CourseInfos-inner-container-explain'
          />
        </div>

        <div className='CourseInfos-inner-container-input-container'>
          <button className='CourseInfos-inner-container-input' onClick={() => handleSubmit('professional')}>
            ذخیره
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseInfos;
