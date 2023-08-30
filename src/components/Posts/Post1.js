// Post1.js

import { Card } from "react-bootstrap";

const Post1 = () => {
	return (
		<Card>
			<Card.Img
				variant="top"
				src=
				"https://media.geeksforgeeks.org/wp-content/cdn-uploads/20230305183140/Javascript.jpg"
				width={20}
				height={250}
			/>
			<Card.Body>
				<Card.Title>JAVASCRIPT</Card.Title>
				<Card.Text>
					JavaScript is the world most popular
					lightweight, interpreted compiled programming
					language. It is also known as scripting
					language for web pages. It is well-known for
					the development of web pages, many non-browser
					environments also use it. JavaScript can be
					used for Client-side developments as well as
					Server-side developments
				</Card.Text>
				<a href="#" className="btn btn-primary">Read More</a>
			</Card.Body>
		</Card>
	);
};

export default Post1;
