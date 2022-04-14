import React from 'react';
import BTNavbar from 'react-bootstrap/Navbar';
import { Container, Nav, NavDropdown, Item, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { AiOutlineForm, AiOutlineLogin } from 'react-icons/ai';

import icon from 'assets/images/bkdnoj-favicon-noring.png';
import './Navbar.scss'

class UserAuthSection extends React.Component {
    render() {
        return (
            <>
                <Nav.Link as={Link} to="/sign-up">
                    <AiOutlineForm className='react-icons' size={10} />
                    Sign Up
                </Nav.Link>
                <Nav.Link as={Link} to="/sign-in">
                    <AiOutlineLogin className='react-icons' size={10} />
                    Sign In
                </Nav.Link>
            </>
        )
    }
}

export default class Navbar extends React.Component {
    render() {
        return (
            <BTNavbar bg="light" expand="md" className="navbar py-0" id="navbar" fixed="top">
                <Container>
                    <BTNavbar.Brand as={Link} id="brand" to="/">
                        <Image src={icon} id="site-brand" />
                        <span>bkdnOJ</span>
                    </BTNavbar.Brand>

                    <Nav className="navbar-user-auth d-flex flex-row justify-content-end d-md-none">
                        <UserAuthSection/>
                    </Nav>

                    <BTNavbar.Toggle aria-controls="basic-navbar-nav" />
                    <BTNavbar.Collapse id="basic-navbar-nav">
                        <Nav className="">
                            <Nav.Link href="#post">Post</Nav.Link>
                            <Nav.Link href="#problem">Problem</Nav.Link>
                            <NavDropdown title="Contests" id="basic-nav-dropdown">
                                <NavDropdown.Item href="#action/3.1">Upcoming</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.2">Ongoing</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.3">Past</NavDropdown.Item>
                            </NavDropdown>
                            <Nav.Link href="#organization">Organization</Nav.Link>
                            <Nav.Link href="#user">User</Nav.Link>
                        </Nav>
                    </BTNavbar.Collapse>

                    <Nav className="navbar-user-auth flex-row justify-content-end d-none d-md-flex">
                        <UserAuthSection/>
                    </Nav>
                </Container>
            </BTNavbar>
        )
    }
}
