import React from 'react';
import './ClickButton.css';

function ClickButton(props) {
  return (
    <button className={props.buttonstyle} onClick={props.func}>
      {props.text}{props.icon}
    </button>
  );
}

export default ClickButton;
