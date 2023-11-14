import Image from "next/image";
import React from 'react';
import '/styles/system32/applications/icon.sass';

const Icon = ({ title, iconPath, onClick }) => {
  return (
    <div className="icon" onClick={onClick}>
      <Image className="icon-img" src={iconPath} alt={title} width={50} height={40}/>
      <div className="icon-text">{title}</div>
    </div>
  );
};

export default Icon;
