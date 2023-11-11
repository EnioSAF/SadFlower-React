// Dans Icon.js
import React from 'react';
import '/styles/system32/applications/icon.sass';

const Icon = ({ title, iconPath, onClick }) => {
  return (
    <div className="icon" onClick={onClick}>
      <img className="icon-img" src={iconPath} alt={title} />
      <div className="icon-text">{title}</div>
    </div>
  );
};

export default Icon;
