import React, { useState } from 'react';
import Dinput2 from '../../Dash-input-2/Dinput2';
import './InputLabel.css';
import { AiFillEdit, AiOutlineSave } from 'react-icons/ai'; 

function InputLabel({ label, type, id, placeholder, value, onChange }) {
  const [isEditable, setIsEditable] = useState(false);

  // Toggle editable state
  const toggleEditable = () => {
    setIsEditable(!isEditable);
  };

  return (
    <div className='inputl-container'>
      <div className='inputl-inner-container'>
        <div className='inputl-label-container'>
          {label}
        </div>
        <div className='editable-input-container'>
          <Dinput2
            type={type}
            id={id}
            placeholder={placeholder}
            value={value}          // Display value passed as props
            onChange={onChange}    // Pass the onChange event handler
            readOnly={!isEditable} // Input is editable based on state
          />
          <button className='edit-button' onClick={toggleEditable}>
            {isEditable ? 'ذخیره' : <AiFillEdit />}
          </button>
        </div>
      </div>
    </div>
  );
}

export default InputLabel;
