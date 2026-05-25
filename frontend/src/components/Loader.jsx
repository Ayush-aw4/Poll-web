import React from 'react';
import '../styles/loader.css';

const Loader = ({ text = 'Loading...' }) => {
  return (
    <div className="loader-container">
      <div className="spinner"></div>
      <div className="loader-text">{text}</div>
    </div>
  );
};

export default Loader;
