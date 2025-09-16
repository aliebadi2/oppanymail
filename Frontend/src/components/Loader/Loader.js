import React from "react";
import "./Loader.css";

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loading-text">صبر کنید ...</div>
      <div className="loading-bar">
        <div className="progress"></div>
      </div>
    </div>
  );
};

export default Loader;
