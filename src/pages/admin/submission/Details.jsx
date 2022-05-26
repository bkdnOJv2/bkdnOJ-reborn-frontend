import React from 'react';
import { connect } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import { Form, Row, Col, Tabs, Tab } from 'react-bootstrap';

import { FaPaperPlane, FaSignInAlt, FaExternalLinkAlt } from 'react-icons/fa';

import submissionAPI from 'api/submission';
import { SpinLoader } from 'components';
import { withParams } from 'helpers/react-router'
import { setTitle } from 'helpers/setTitle';

import GeneralDetails from './_/GeneralDetails';
import TestcaseDetails from './_/TestcaseDetails';
import './Details.scss';

class AdminSubmissionDetails extends React.Component {
  constructor(props) {
    super(props);
    const { id } = this.props.params;
    this.id = id;
    this.state = {
      loaded: false, errors: null,
      data: undefined,
    };
  }

  componentDidMount() {
    setTitle(`Admin | Submission#${this.id}`)
    submissionAPI.getSubmissionDetails({id: this.id})
    .then((res) => {
      this.setState({
        data: res.data,
        loaded: true,
      })
    }).catch((err) => {
      this.setState({
        loaded: true,
        errors: err,
      })
    })
  }

  render() {
    if (this.state.redirectUrl) {
      return (
        <Navigate to={`${this.state.redirectUrl}`} />
      )
    }
    const {loaded, errors, data} = this.state;

    return (
      <div className="admin submission-panel">
        <h4 className="submission-title">
          { !loaded && <span><SpinLoader/> Loading...</span>}
          { loaded && !!errors && <span>Something went wrong.</span>}
          { loaded && !errors && `Viewing submission#${this.id}` }
        </h4>
        <hr/>
        <div className="submission-details">
          { !loaded && <span><SpinLoader/> Loading...</span> }

          { loaded && !errors && <>
            <Tabs defaultActiveKey="general" id="sub-tabs" className="pl-2">
              <Tab eventKey="general" title="General">
                <GeneralDetails id={this.id} data={this.state.data} />
              </Tab>
              <Tab eventKey="runs" title="Results">
                <TestcaseDetails id={this.id} data={this.state.data} />
              </Tab>
            </Tabs>
          </>
          }
        </div>
      </div>
    )
  }
}

let wrappedPD = AdminSubmissionDetails;
wrappedPD = withParams(wrappedPD);
const mapStateToProps = state => {
    return { user : state.user.user }
}
wrappedPD = connect(mapStateToProps, null)(wrappedPD);
export default wrappedPD;
