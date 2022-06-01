import React from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';

import { Nav, NavDropdown } from 'react-bootstrap';
import { Link, Navigate } from 'react-router-dom';

import { AiOutlineForm, AiOutlineLogin, AiOutlineLogout, AiOutlineProfile } from 'react-icons/ai';
import { GrUserAdmin } from 'react-icons/gr';

import authClient from 'api/auth';
import profileClient from 'api/profile';

import { getAdminPageUrl } from 'api/urls';
import { updateUser, updateProfile, clearUser } from 'redux/User/actions'

import { __ls_get_auth_user, __ls_remove_credentials,
        __ls_set_auth_user, } from 'helpers/localStorageHelpers';

class UserAuthSection extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            redirect: false,
        }
        const user = (this.props.user.user) || __ls_get_auth_user();
        if (!!user && !this.props.user.user) {
            this.props.updateUser(user);
        }
    }

    componentDidMount() {
        profileClient.fetchProfile().then((res) => {
            __ls_set_auth_user(res.data.owner);
            this.props.updateUser({...res.data.owner, avatar: res.data.avatar});
            this.props.updateProfile({...res.data});
        }).catch((err) => {
            console.log(err);
        })
    }

    signOutHandler() {
        authClient.signOut()
        .then((res) => {
            this.props.clearUser();
            toast.success("See you later!");
        })
        .catch((err) => {
            __ls_remove_credentials();
            // toast.error("You are already logged out!");
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

        const user = this.props.user.user;
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
                    <NavDropdown id="basic-nav-dropdown-userauth"
                    >
                        {/* {
                            user.is_staff &&
                            <NavDropdown.Item as={Link} to="/admin" >
                                <GrUserAdmin className='react-icons' size={10} />
                                Admin
                            </NavDropdown.Item>
                        } */}
                        {
                            user.is_staff &&
                            // <NavDropdown.Item onClick={() => {
                            //     console.log(getAdminPageUrl())
                            //     window.location = getAdminPageUrl()
                            // }}>
                            <NavDropdown.Item as={Link} to="/admin">
                                <GrUserAdmin className='react-icons' size={10} />
                                Admin
                            </NavDropdown.Item>
                        }
                        <NavDropdown.Item as={Link} to="/profile">
                            <AiOutlineProfile className='react-icons' size={10} />
                            Profile
                        </NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item style={{color: 'red'}} href="#"
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
    profile: state.user.profile,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateUser: (user) => dispatch(updateUser({user: user})),
    updateProfile: (profile) => dispatch(updateProfile({profile: profile})),
    clearUser: () => dispatch(clearUser()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserAuthSection);