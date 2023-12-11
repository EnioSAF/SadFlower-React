import Image from "next/image";
import React from 'react';

import '/styles/system32/applications/icon.sass';

const Icon = ({ title, iconPath, onClick, onTouchStart }) => {

  const handleTouchStart = (event) => {
    event.stopPropagation();  // Empêche la propagation de l'événement aux parents
    onTouchStart && onTouchStart(event);  // Appelle la fonction onTouchStart si elle est définie
  };

  return (
    <div className="icon" onClick={onClick} onTouchStart={handleTouchStart}>
      <Image className="icon-img" src={iconPath} alt={title} width={50} height={40}/>
      <div className="icon-text">{title}</div>
    </div>
  );
};

export default Icon;