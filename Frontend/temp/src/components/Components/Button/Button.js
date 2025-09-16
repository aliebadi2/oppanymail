import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Button.css';

function Button({text, icon, href, buttonstyle,  onClick, ...otherProps}) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (href) {
      navigate(href);
    }

    if (onClick) {
      onClick();
    }
  };
  const buttonClass = `primary-buttonn ${buttonstyle || ''}`;
  return (
    <button onClick={handleClick} className={buttonClass} {...otherProps}>
      {text}{icon}
    </button>
  );
}

export default Button;
