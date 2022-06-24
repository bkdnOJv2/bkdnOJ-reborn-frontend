import React from 'react';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import { updateUser, clearUser } from 'redux/User/actions';
import { updateProfile } from 'redux/Profile/actions';

import { Link } from 'react-router-dom';
import { Row, Col, Tabs, Tab } from 'react-bootstrap';

import { FaUniversity } from 'react-icons/fa';

import profileClient from 'api/profile';
import { log } from 'helpers/logger';

import SpinLoader from 'components/SpinLoader/SpinLoader';

import './UserProfile.scss';
import { __ls_set_auth_user, __ls_get_access_token } from 'helpers/localStorageHelpers';
import { setTitle } from 'helpers/setTitle';
import { Navigate } from 'react-router-dom';

import { AboutTab, } from './_';

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: this.props.profile,
      loaded: false,
    }
    this.user = this.props.user;
    setTitle('Profile')
  }

  fetch() {
    const profile = this.state.profile;
    // Sometimes the Token hasn't been set yet, so it causes profile
    // to not properly loaded.
    // We waited for 2s...
    setTimeout(() => profileClient.fetchProfile().then((res) => {
      this.setState({
        profile: res.data,
        loaded: true,
      })
      this.props.updateUser({...res.data.owner, avatar: res.data.avatar});
      this.props.updateProfile({ ...res.data, });
    }).catch((err) => {
      console.log(err);
    }), 1000); // TODO: remove this number
  }

  componentDidMount() {
    this.fetch();
  }

  render() {
    const {profile, loaded} = this.state;
    if (!loaded) {
      return (
        <div className="user-profile-container shadow rounded">
          <h4 className="title">Loading</h4>
          <div className="loading-wrapper flex-center">
            <SpinLoader className="user-profile spinloading" size={30} margin="0"/>
          </div>
        </div>
      )
    }
    if (!profile) {
      toast.error("Please log-in again.")
      return <Navigate to="/sign-in"></Navigate>
    }

    return (
      <div className="user-profile-container shadow rounded">
        <h4 className="title">{profile.display_name}</h4>
        <Row className="profile-content pt-3 pb-3">
          <Col md={3} className="flex-center-col">
            <img src={profile.avatar} className="avatar"
                  alt={`User ${profile.owner.username}'s avatar`}/>
            <h5 className='pt-2'>{profile.owner.username}</h5>
          </Col>

          <Col md={9} className="text-left tabs-wrapper">
            <Tabs defaultActiveKey="about" className="profile-tabs mb-3">
              <Tab eventKey="settings" title="Settings">
                That thou hast her it is not all my grief, And yet it may be said I loved her dearly; That she hath thee is of my wailing chief, A loss in love that touches me more nearly. Loving offenders thus I will excuse ye: Thou dost love her, because thou know'st I love her; And for my sake even so doth she abuse me, Suffering my friend for my sake to approve her. If I lose thee, my loss is my love's gain, And losing her, my friend hath found that loss;
              </Tab>
              <Tab eventKey="compete" title="Compete">
                That thou hast her it is not all my grief, And yet it may be said I loved her dearly; That she hath thee is of my wailing chief, A loss in love that touches me more nearly. Loving offenders thus I will excuse ye: Thou dost love her, because thou know'st I love her; And for my sake even so doth she abuse me, Suffering my friend for my sake to approve her. If I lose thee, my loss is my love's gain, And losing her, my friend hath found that loss;
              </Tab>
              <Tab eventKey="about" title="About">
                <AboutTab profile={profile} />
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </div>
    )
  }
};

const mapStateToProps = state => {
  return {
    user: state.user.user,
    profile: state.profile.profile,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateUser: (user) => dispatch(updateUser({user: user})),
    updateProfile: (profile) => dispatch(updateProfile({profile: profile})),
    clearUser: () => dispatch(clearUser()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
