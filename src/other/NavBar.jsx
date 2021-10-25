import React from "react";
import 'bootswatch/dist/vapor/bootstrap.css'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Container from 'react-bootstrap/Container'

export const NavBar = () => {
    return (
        <>
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand href="#">Lille</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link href="./calendar">Calendar</Nav.Link>
                        <NavDropdown title="Time Log">
                            <NavDropdown.Item href="./task">Task</NavDropdown.Item>
                            <NavDropdown.Item href="./timelog">Time Log</NavDropdown.Item>
                            <NavDropdown.Item href="./chart">Chart</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Container>
            </Navbar>
        </>
    );
};
