import React from 'react';
import BTNavbar from 'react-bootstrap/Navbar';
import { Container, Nav, NavDropdown, Item, Image } from 'react-bootstrap';
import brand from '../../assets/images/bkdnoj-brand.png'
import './Navbar.scss'

export default class Navbar extends React.Component {

	render() {
		return (
			<BTNavbar bg="light" expand="sm" className="navbar py-0" id="navbar" fixed="top">
				<Container>
					<BTNavbar.Brand id="logo" href="#home">
						{/* <Image src={brand} id="site-brand" /> */}
						Home
					</BTNavbar.Brand>

					<BTNavbar.Toggle aria-controls="basic-navbar-nav"/>
					<BTNavbar.Collapse id="basic-navbar-nav">
						<Nav className="me-auto">
							<Nav.Link href="#post">Posts</Nav.Link>
							<Nav.Link href="#problem">Problems</Nav.Link>
							<NavDropdown title="Contests" id="basic-nav-dropdown">
								<NavDropdown.Item href="#action/3.1">Upcoming</NavDropdown.Item>
								<NavDropdown.Item href="#action/3.2">Ongoing</NavDropdown.Item>
								<NavDropdown.Item href="#action/3.3">Past</NavDropdown.Item>
							</NavDropdown>
							<Nav.Link href="#organization">Organization</Nav.Link>
							<Nav.Link href="#user">Users</Nav.Link>
						</Nav>
					</BTNavbar.Collapse>
				</Container>
			</BTNavbar>
		)
	}
}