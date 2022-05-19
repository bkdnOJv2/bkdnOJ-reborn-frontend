import React from 'react';
import { connect } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import { Form, Row, Col, Tabs, Tab } from 'react-bootstrap';

import { FaPaperPlane, FaSignInAlt, FaExternalLinkAlt } from 'react-icons/fa';

import problemAPI from 'api/problem';
import { SpinLoader } from 'components';
import { withParams } from 'helpers/react-router'
import { setTitle } from 'helpers/setTitle';

import GeneralDetails from './_/GeneralDetails';

import './AdminProblemDetails.scss';


class AdminProblemDetails extends React.Component {
  constructor(props) {
    super(props);
    const { shortname } = this.props.params;
    this.shortname = shortname;
    this.state = { 
      loaded: false, errors: null, 
      options: undefined,
      general: undefined,
      testData: undefined,
    };
  }

  async componentDidMount() {
    Promise.all([
      problemAPI.adminOptionsProblemDetails({shortname: this.shortname}),
      problemAPI.getProblemDetails({shortname: this.shortname})
    ]).then((res) => {
      const [optionsRes, generalRes] = res;
      // console.log(optionsRes.data)
      // console.log(generalRes.data)
      this.setState({
        options: optionsRes.data,
        general: generalRes.data,
        loaded: true,
      })
      setTitle(`Admin | Problem ${generalRes.data.title}`)
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
    const {loaded, general, options} = this.state;
    
    return (
      <div className="admin problem-panel">
        <h4 className="problem-title"> 
          { !loaded ? <span><SpinLoader/> Loading...</span> : `Editing problem ${general.title}` }
        </h4>
        <hr/>
        <div className="problem-details">
          { 
          !loaded ? <span><SpinLoader/> Loading...</span> 
          : <>
          <Tabs defaultActiveKey="general" id="uncontrolled-tab-example" className="pl-2">
            <Tab eventKey="general" title="General">
              <GeneralDetails data={general} options={options}/>
            </Tab>
            <Tab eventKey="data" title="Test Data">
              <p>123</p>
            </Tab>
          </Tabs>
          </>
          }
        </div>
      </div>
    )
  }
}

let wrappedPD = AdminProblemDetails;
wrappedPD = withParams(wrappedPD);
const mapStateToProps = state => {
    return { user : state.user.user }
}
wrappedPD = connect(mapStateToProps, null)(wrappedPD);
export default wrappedPD;