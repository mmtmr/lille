import React from "react";
import 'bootswatch/dist/vapor/bootstrap.css'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { toast } from "react-toastify";

toast.configure();
export const NavBar = ({ setAuth }) => {
    const handleLogout = async e => {
        e.preventDefault();
        try {
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user_id");
            setAuth(false);
            toast.success("Logout successfully");
        } catch (err) {
            console.error(err.message);
        }
    };

    return (
        <>
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand href="./">Lille</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link href="./calendar">Calendar</Nav.Link>
                        {//TODO Add options
                        /* <Nav.Link href="./revision">Revision</Nav.Link>
                        <NavDropdown title="Time Log">
                            <NavDropdown.Item href="./task">Task</NavDropdown.Item>
                            <NavDropdown.Item href="./timelog">Time Log</NavDropdown.Item>
                            <NavDropdown.Item href="./chart">Chart</NavDropdown.Item>
                        </NavDropdown> */}
                    </Nav>
                    <Form className="d-flex">
                        {/* <Nav.Link href="./Option">Option</Nav.Link> */}
                        <Button variant="outline-danger" onClick={e => handleLogout(e)}>Logout</Button>
                    </Form>
                </Container>
            </Navbar>
        </>
    );
};
