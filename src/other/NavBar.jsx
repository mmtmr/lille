import React from "react";
import 'bootswatch/dist/vapor/bootstrap.min.css'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'

export const NavBar = () => {
    return (
        <>
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand href="#">Lille</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link href="./calendar">Calendar</Nav.Link>
                        <Nav.Link href="./timelog">Time Log</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
        </>
    );
};
