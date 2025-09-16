import React, { useState } from 'react';
import './Switch.css'; // Include the CSS for styling

function Switch() {
  const [isToggled, setIsToggled] = useState(false);

  // Function to handle the toggle
  const handleToggle = () => {
    setIsToggled(!isToggled); // Toggle the state
  };

  return (
    <div className={`switch ${isToggled ? 'toggled' : ''}`} onClick={handleToggle}>
      <div className="switch-handle"></div>
    </div>
  );
}

export default Switch;
