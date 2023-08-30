// Posts.js https://www.geeksforgeeks.org/blog-app-using-reactjs/
 
import React from "react";
import Post1 from "./Posts/Post1";
import Post2 from "./Posts/Post2";
import Post3 from "./Posts/Post3";
import Post4 from "./Posts/Post4";
import { Container, Row, Col, Card } from 'react-bootstrap';
 
 
const Posts = () => {
    return (
        <Container>
            <Row className="justify-content-between">
                <Col md={8} className="mb-4 mt-4">
                    <Post1 />
                </Col>
                <Col md={2} className="mt-4 float-right">
                    <Card>
                        <Card.Body>
                            <Card.Title>Recent Posts</Card.Title>
                            <ul className="list-unstyled">
                                <li><a href="#">JavaScript</a></li>
                                <li><a href="#">Data Structure</a></li>
                                <li><a href="#">Algorithm</a></li>
                                <li><a href="#">Computer Network</a></li>
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={8} className="mb-4">
                    <Post2 />
                </Col>
                <Col md={8} className="mb-4">
                    <Post3 />
                </Col>
                <Col md={8} className="mb-4">
                    <Post4 />
                </Col>
            </Row>
        </Container>
    );
};
 
export default Posts;