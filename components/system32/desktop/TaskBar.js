import React, { useState, useEffect } from 'react';
import '/styles/system32/taskbar.sass';

const TaskBar = () => {
	const [currentTime, setCurrentTime] = useState(new Date());

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	return (
		<div className="footer">
			<button className="start-button">
				<span className="logo">👁</span>
				<span className="start-text">Start</span>
			</button>
			<div className="separator">|</div>
			<div className="spacer"></div>
			<div className="separator">|</div>
			<div className="taskbar">
				{/* Met ici tes icônes de tâches, genre des liens vers tes projets et tout ça */}
			</div>
			<div className="time-zone">
				{currentTime.toLocaleDateString()} <span className="separator">|</span> {currentTime.toLocaleTimeString()}
			</div>
		</div>
	);
};

export default TaskBar;
