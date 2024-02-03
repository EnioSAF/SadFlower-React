import React, { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import '/styles/system32/windows/WhoAmI/SkillCard.sass'; // Crée ton fichier SASS ici

const SkillCard = ({ title, levels, description, illustration, labels, overlays, overlayPosition }) => {
  const [flipped, setFlipped] = useState(false);

  const { transform, opacity } = useSpring({
    opacity: flipped ? 1 : 0,
    transform: `perspective(600px) rotateY(${flipped ? 180 : 0}deg)`,
    config: { mass: 5, tension: 500, friction: 80 }
  });

  return (
    <div className="skill-card" onClick={() => setFlipped(state => !state)}>
      <animated.div className="skill-card-front" style={{ opacity: opacity.interpolate(o => 1 - o), transform }}>
        <div className='skill-card-content'>
          {overlays && overlays.map((overlay, index) => (
            <div key={index} className={`skill-card-overlay`} style={{ ...overlay.style }}></div>
          ))}
          <h3>{title}</h3>
          <div className='skill-card-Info'>
            <img src={illustration} alt={`${title} illustration`} />
            <div className='skill-card-label'>
              {levels.map((level, index) => (
                <div key={index}>
                  <div className='Level'>
                    <div className="label">{labels[index]}</div>
                    <div className="progress-bar">
                      <div className="progress" style={{ width: `${level}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </animated.div>
      <animated.div className="skill-card-back" style={{ opacity, transform: transform.interpolate(t => `${t} rotateY(180deg)`) }}>
        <div className='skill-card-content'>
          {overlays && overlays.map((overlay, index) => (
            <div key={index} className={`skill-card-overlay`} style={{ ...overlay.style }}></div>
          ))}
          <p>{description}</p>
        </div>
      </animated.div>
    </div>
  );
};

export default SkillCard;