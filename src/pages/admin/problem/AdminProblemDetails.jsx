import React from 'react';
import { toast } from 'react-toastify'
import { connect } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import { Button, Tabs, Tab } from 'react-bootstrap';

import { FaRegTrashAlt, FaGlobe } from 'react-icons/fa';

import problemAPI from 'api/problem';
import { SpinLoader, ErrorBox } from 'components';
import { withParams } from 'helpers/react-router'
import { setTitle } from 'helpers/setTitle';

import GeneralDetails from './_/GeneralDetails';
import TestDataDetails from './_/TestDataDetails';
import TestcaseDetails from './_/TestcaseDetails';

import './AdminProblemDetails.scss';


class AdminProblemDetails extends React.Component {
  constructor(props) {
    super(props);
    const { shortname } = this.props.params;
    this.shortname = shortname;
    this.state = {
      loaded: false, errors: null,
      options: undefined,
      problemTitle: undefined,
      general: undefined,
      testData: undefined,

      formErrors: null,
    };
  }
  refetch(newshortname=null) {
    let childKey = this.state.childKey;
    if (newshortname) {
      this.shortname=newshortname;
      childKey = Math.random();
    }

    Promise.all([
      //problemAPI.adminOptionsProblemDetails({shortname: this.shortname}),
      problemAPI.getProblemDetails({shortname: this.shortname})
    ]).then((res) => {
      // const [optionsRes, generalRes] = res;
      const [generalRes] = res;
      // console.log(optionsRes.data)
      // console.log(generalRes.data)
      this.setState({
        shortname: generalRes.data.shortname,
        problemTitle: generalRes.data.title,
        // options: optionsRes.data,
        general: generalRes.data,
        loaded: true,
        childKey,
      })
      setTitle(`Admin | Problem. ${generalRes.data.shortname}`)
    }).catch((err) => {
      this.setState({
        loaded: true,
        errors: err,
      })
    })
  }

  componentDidMount() {
    this.refetch();
  }

  deleteObjectHandler() {
    let conf = window.confirm("Are you sure you want to delete this problem?")
    if (conf) {
      problemAPI.adminDeleteProblem({shortname: this.shortname})
        .then((res) => {
          toast.success("OK Deleted.");
          this.setState({ redirectUrl : '/admin/problem/' })
        })
        .catch((err) => {
          toast.error(`Cannot delete. (${err})`);
        })
    }
  }

  render() {
    if (this.state.redirectUrl) {
      return (
        <Navigate to={`${this.state.redirectUrl}`} />
      )
    }
    const {loaded, errors, general, options} = this.state;
    const { formErrors } = this.state;

    return (
      <div className="admin problem-panel wrapper-vanilla">
        <h4 className="problem-title">
          { !loaded && <span><SpinLoader/> Loading...</span>}
          { loaded && !!errors && <span>Something went wrong</span>}
          { loaded && !errors && (
            <div className="panel-header">
              <span className="title-text">{`Problem | ${this.state.problemTitle}`}</span>
              <span>
                <Button className="btn-svg" size="sm" variant="dark"
                  onClick={()=>this.setState({ redirectUrl: `/problem/${this.shortname}` })}>
                    <FaGlobe/><span className="d-none d-md-inline">View on Site</span>
                </Button>
              </span>
              <span>
                <Button className="btn-svg" size="sm" variant="danger"
                  onClick={()=>this.deleteObjectHandler()}>
                    <FaRegTrashAlt/><span className="d-none d-md-inline">Delete</span>
                </Button>
              </span>
            </div>
          )}
        </h4>
        <hr/>
        <div className="problem-details">
          { !loaded && <span><SpinLoader/> Loading...</span> }

          { loaded && !errors && <>
          <ErrorBox errors={formErrors} />
          <Tabs defaultActiveKey="general" id="prob-tabs" className="pl-2">
            <Tab eventKey="general" title="General">
              <GeneralDetails
                shortname={this.shortname} data={general}
                setProblemTitle={((title) => this.setState({problemTitle : title}))}
                setErrors={(e)=>this.setState({formErrors: e})}

                refetch={(newshort)=>this.refetch(newshort)}
              />
            </Tab>
            <Tab eventKey="data" title="Test Data">
              <TestDataDetails
                key={`prb-dt-data${this.state.childKey}`} shortname={this.shortname}
                setErrors={(e)=>this.setState({formErrors: e})}
                forceRerender={() => this.setState({childKey: Math.random()})}
              />
            </Tab>
            <Tab eventKey="test" title="Test Cases">
              <TestcaseDetails
                key={`prb-dt-case${this.state.childKey}`} shortname={this.shortname}
                setErrors={(e)=>this.setState({formErrors: e})}
                forceRerender={() => this.setState({childKey: Math.random()})}
              />
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
