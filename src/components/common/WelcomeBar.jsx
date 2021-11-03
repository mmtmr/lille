import React from "react";
import 'bootswatch/dist/vapor/bootstrap.css'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { Link, Redirect } from "react-router-dom";

export const WelcomeBar = () => {
    
    return (
        <>
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand href="#">Lille</Navbar.Brand>
                    <Form className="d-flex">
                    {/* <Link to="/register">Sign Up</Link>&nbsp;&nbsp;&nbsp;&nbsp; */}
                    <Link to="/login">Log In</Link>
                    </Form>
                </Container>
            </Navbar>
        </>
    );
};
