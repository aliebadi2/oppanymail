import React from 'react';
import './Inputfield.css';

function Inputfield(props) {
  return (
    <div className={`input-field-container ${props.error ? 'input-error animate-error' : ''}`}>
      <input
        className={`input-field ${props.error ? 'input-field-error' : ''}`}   
        type={props.type}
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
        autoComplete={props.autoComplete}
      />
      {props.icon}
    </div>
  );
}

export default Inputfield;
