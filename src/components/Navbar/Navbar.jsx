import React from 'react';
import { connect } from "react-redux"
import { toast } from 'react-toastify';

import { Container, Nav, NavDropdown, Item, Image } from 'react-bootstrap';
import { Link, Navigate } from 'react-router-dom';

import { AiOutlineForm, AiOutlineLogin, AiOutlineLogout, AiOutlineProfile } from 'react-icons/ai';
import { GrUserAdmin } from 'react-icons/gr';

import BTNavbar from 'react-bootstrap/Navbar';
import authClient from 'api/auth';
import { updateUser, clearUser } from 'redux/User/actions'

import {log} from 'helpers/logger';

import { __ls_get_auth_user, __ls_remove_credentials } from 'helpers/localStorageHelpers';
import icon from 'assets/images/bkdnoj-favicon-noring.png';
import './Navbar.scss'

class UserAuthSection extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            redirect: false,
        }
    }

    signOutHandler() {
        authClient.signOut()
        .then((res) => {
            __ls_remove_credentials();
            toast.success("Signed Out! You are now anonymous.");
        })
        .catch((err) => {
            toast.error("You are already logged out!");
        })
        .finally(() => {
            this.setState({redirect: true})
            // window.location.href = "/";
        })
    }

    render() {
        if (this.state.redirect) {
            this.setState({redirect: false})
            return <Navigate to="/" />
        }

        const user = __ls_get_auth_user();

        if (!user)  
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
        else
            return (
                <>
                    <div className="nav-link" id="fake">
                        {`Hello, ${user.username}!`}
                    </div>
                    <NavDropdown id="basic-nav-dropdown">
                        {
                            user.is_staff &&
                            <NavDropdown.Item href="/admin">
                                <GrUserAdmin className='react-icons' size={10} />
                                Admin
                            </NavDropdown.Item>
                        }
                        <NavDropdown.Item href="/profile">
                            <AiOutlineProfile className='react-icons' size={10} />
                            Profile
                        </NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="#" style={{color: 'red'}}
                            onClick={() => this.signOutHandler()}
                        >
                            <AiOutlineLogout className='react-icons' size={10} />
                            Sign Out
                        </NavDropdown.Item>
                    </NavDropdown>
                </>
            )
    }
}
const mapStateToProps = state => {
  return {
    user: state.user.user,
  }
}
const mapDispatchToProps = dispatch => {
  return {
    updateUser: (user) => dispatch(updateUser({user: user})),
    clearUser: () => dispatch(clearUser()),
  }
}
const RDUserAuthSection = connect(mapStateToProps, undefined)(UserAuthSection);
// --------------------------------

export default class Navbar extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <BTNavbar bg="light" expand="md" className="navbar py-0" id="navbar" fixed="top">
                <Container>
                    <BTNavbar.Brand as={Link} id="brand" to="/">
                        <Image src={icon} id="site-brand" />
                        <span>bkdnOJ</span>
                    </BTNavbar.Brand>

                    <Nav className="navbar-user-auth d-flex flex-row justify-content-end d-md-none">
                        <RDUserAuthSection />
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
                        <RDUserAuthSection />
                    </Nav>
                </Container>
            </BTNavbar>
        )
    }
}
