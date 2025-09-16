import React, { useState } from 'react';
import './DateInput.css';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import calendarIcon from '../../../../../../../assets/Calendar(1).svg'
const DateInput = () => {
    const [selectedDate, setSelectedDate] = useState(null);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const minDate = new Date("2024/09/01");
    const maxDate = new Date("2024/09/30");

    return (
        <div className="custom-datepicker">
            <img src={calendarIcon} alt="calendar-icon" className='datepicker-calendar-icon' />
            <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="MM/dd/yyyy h:mm aa"
                minDate={minDate}
                maxDate={maxDate}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="Time"
                placeholderText='تاریخ و ساعت'
            />
        </div>
    );
};

export default DateInput;
