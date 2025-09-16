import React from 'react';
import './Dinput2.css';

const Dinput2 = (props) => {
  return (
    <div className='d-input-2-field-container'>
      <input
        className='input-field'
        type={props.type}
        id={props.id}
        placeholder={props.placeholder}
        value={props.value}         // Add value to control the input
        onChange={props.onChange}   // Add onChange to update state
        readOnly={props.readOnly}   // Add readOnly to control editability
      />
    </div>
  );
};

export default Dinput2;
