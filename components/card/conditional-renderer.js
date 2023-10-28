const ConditionalRender = ({ condition, children }) => {
	if (condition) return children;
	return null;
};

export default ConditionalRender;
