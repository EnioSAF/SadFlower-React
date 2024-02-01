import React, { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import '/styles/system32/windows/WhoAmI/SkillCard.sass'; // Crée ton fichier SASS ici

const SkillCard = ({ title, levels, description, illustration, labels }) => {
  const [flipped, setFlipped] = useState(false);

  const { transform, opacity } = useSpring({
    opacity: flipped ? 1 : 0,
    transform: `perspective(600px) rotateY(${flipped ? 180 : 0}deg)`,
    config: { mass: 5, tension: 500, friction: 80 }
  });

  return (
    <div className="skill-card" onClick={() => setFlipped(state => !state)}>
      <animated.div className="skill-card-front" style={{ opacity: opacity.interpolate(o => 1 - o), transform }}>
        <h3>{title}</h3>
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
      </animated.div>
      <animated.div className="skill-card-back" style={{ opacity, transform: transform.interpolate(t => `${t} rotateY(180deg)`) }}>
        <img src={illustration} alt={`${title} illustration`} />
        <p>{description}</p>
      </animated.div>
    </div>
  );
};

export default SkillCard;