import React, { useState, useEffect } from 'react';
import Image from 'next/image'
import '/styles/system32/desktop/taskbar.sass';

const TaskBar = ({ user, onSignInClick, onSignUpClick, onUserInfoClick }) => {
	const [currentTime, setCurrentTime] = useState(new Date());
	const [showStartMenu, setShowStartMenu] = useState(false);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	const toggleStartMenu = () => setShowStartMenu(!showStartMenu);


	return (
		<div className="footer">
			<button className="start-button" onClick={toggleStartMenu}>
				<span className="logo">🌸</span>
				<span className="start-text">Start</span>
			</button>
			{showStartMenu && (
				<div className="start-menu">
					<h4>SadFlower OS.</h4>

					{!user ? (
						<>
							<div className="auth-buttons">
								<button className="sign-in-button" onClick={onSignInClick}>
									<Image
										src="/Icon/Windows95/Sort by Category [Without duplicates]/People/User program.ico"
										alt="SignIn"
										width={32}
										height={32}
										className="auth-icon"
									/>
									SignIn
								</button>
							</div>
						</>
					) : (
						<div className="user-info">
							<button className="user-info-button" onClick={onUserInfoClick}>
							<Image
										src="/Icon/Windows95/Sort by Category [Without duplicates]/People/Agent.ico"
										alt="SignIn"
										width={32}
										height={32}
										className="auth-icon"
									/>
								UserInfo
							</button>
						</div>
					)}
				</div>
			)}
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
