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

import { setTitle } from 'helpers/setTitle';
import { Navigate } from 'react-router-dom';

class AboutTab extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loaded: false,
      data: null,
    }
  }
  render() {
    const { profile } = this.props;

    return (
      <div className="section about-wrapper">
        <Row className="name-and-org p-0">
          <Col md={4} className="p-0">
            <span className="full-name text-truncate">{profile.full_name}</span>
          </Col>
          {
            profile.organization &&
            <Col className="text-right p-0">
            <span className="disp-org d-inline-flex text-truncate" style={{alignItems: "center"}}>
              <span>from</span>
              <Link to="/org/${profile.organization.slug}">{profile.organization.name}</Link>
              <FaUniversity/>
            </span>
            </Col>
          }
        </Row>
        <ul>
          <li><strong>Problems Solved: </strong>
            {profile.problem_count}
          </li>
          <li><strong>Points: </strong>
            {profile.points}
          </li>
          <li><strong>Rating:</strong> {
            profile.rating
            ? profile.rating
            : <em>?</em>
          }</li>
        </ul>

        <hr/>
        <h5>About</h5>
        <div className="about-me">{
          profile.about
        }</div>
      </div>
    )
  }
}

export default AboutTab;
