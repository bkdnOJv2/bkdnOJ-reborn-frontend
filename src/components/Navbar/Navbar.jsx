import React from 'react';
import BTNavbar from 'react-bootstrap/Navbar';
import {Container, Nav, NavDropdown, Item } from 'react-bootstrap';	
import './Navbar.scss'

export default class Navbar extends React.Component {

	render() {
		return (
			<BTNavbar bg="light" expand="lg" className="navbar" id="navbar">
				<Container>
					<BTNavbar.Brand id="logo" href="#home">React-Bootstrap</BTNavbar.Brand>
					<BTNavbar.Toggle aria-controls="basic-navbar-nav" />
					<BTNavbar.Collapse id="basic-navbar-nav">
						<Nav className="me-auto">
							<Nav.Link href="#home">Home</Nav.Link>
							<Nav.Link href="#link">Link</Nav.Link>
							<NavDropdown title="Dropdown" id="basic-nav-dropdown">
								<NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
								<NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
								<NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
								<NavDropdown.Divider />
								<NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
							</NavDropdown>
						</Nav>
					</BTNavbar.Collapse>
				</Container>
			</BTNavbar>
		)
	}
}