import React from 'react';

// Redux
import { connect } from 'react-redux';
import { setParams, clearParams } from 'redux/ContestSubFilter/actions';

import { Button, Table, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { ErrorBox, SpinLoader } from 'components';
import ContestContext from 'context/ContestContext';

// Helpers
import { getHourMinuteSecond, getYearMonthDate } from 'helpers/dateFormatter';

// Assets
import { FaTimes, FaFilter } from 'react-icons/fa';

import './ContestSubFilterSidebar.scss';

const LANGUAGES = [
  {
    "key": "C",
    "name": "C",
  },{
    "key": "C++",
    "name": "C++",
  },{
    "key": "Java",
    "name": "Java",
  },
  {
    "key": "Pascal",
    "name": "Pascal",
  },{
    "key": "Python",
    "name": "Python",
  }
]
const VERDICTS = [
  {
    value: 'AC',
    name: 'Accepted',
  },{
    value: 'WA',
    name: 'Wrong Answer',
  },{
    value: 'TLE',
    name: 'Time Limit Exceeded',
  },{
    value: 'MLE',
    name: 'Memory Limit Exceeded',
  },{
    value: 'RTE',
    name: 'Runtime Error',
  },{
    value: 'CE',
    name: 'Compile Error',
  }
]

class ContestSubFilterSidebar extends React.Component {
  static contextType = ContestContext;

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentDidMount() {
  }

  render() {
    const { contest } = this.context;
    const { user } = this.props;

    const problems = contest.problems || [];

    const isLoggedIn = (!!user);
    const isStaff = (isLoggedIn && user.is_staff);
    const isSuperuser = (isStaff && user.is_superuser);

    return (
      <div className="wrapper-vanilla" id="contest-sub-filter">
        <h4>Submissions Filter</h4>
        { !contest && <span>Contest is not available.</span> }
        { !!contest && <>

          <div className="flex-center-col text-left filter-panel">
            <Row>
              <Col>
              <label id="problem-select-lbl" className="m-0 w-100" htmlFor="only-me">Problem</label>
              <select id="problem-select" className="m-0 w-100" >
                <option key={`ct-fltr-pr-df`} defaultValue>--</option>
                { problems.map((p, idx) =>
                  <option key={`ct-fltr-pr-${idx}`} value={p.shortname}>{`${p.label}. ${p.title}`}</option>
                ) }
              </select>
              </Col>
            </Row>
            <Row>
              <Col xl={4}>
                <label id="problem-select-lbl" className="m-0 w-100" htmlFor="only-me">Language</label>
                <select id="problem-select" className="m-0 w-100" >
                  <option key={`ct-fltr-ln-df`} defaultValue>--</option>
                  { LANGUAGES.map((l, idx) =>
                    <option key={`ct-fltr-ln-${idx}`} value={l.value}>{l.name}</option>
                  ) }
                </select>
              </Col>
              <Col xl={8}>
                <label id="problem-select-lbl" className="m-0 w-100" htmlFor="only-me">Verdict</label>
                <select id="problem-select" className="m-0 w-100" >
                  <option key={`ct-fltr-vd-df`} defaultValue>--</option>
                  { VERDICTS.map((v, idx) =>
                    <option key={`ct-fltr-vd-${idx}`} value={v.value}>{v.name}</option>
                  ) }
                </select>
              </Col>
            </Row>
            <Row>
              <Col className="flex-center w-100 justify-content-start" style={{columnGap: "5px"}}>
                {
                  isLoggedIn &&
                  <label id="only-me-lbl" className="d-flex align-items-center m-0">
                    <input type="checkbox" id="only-me" className="ml-1 mr-1"></input>
                    <span style={{flex: 2}}>Me</span>
                  </label>
                }
                {
                  isStaff &&
                  <>
                    <label id="only-participants-lbl" className="d-flex align-items-center m-0">
                      <input type="checkbox" id="only-participant" className="ml-1 mr-1"></input>
                      <span className="text-danger" style={{flex: 2}}>Participants</span>
                    </label>
                    <label id="only-participants-lbl" className="d-flex align-items-center m-0">
                      <input type="checkbox" id="only-participant" className="ml-1 mr-1"></input>
                      <span className="text-danger" style={{flex: 2}}>Spectators</span>
                    </label>
                  </>
                }
              </Col>
            </Row>
          </div>

          <div className="p-1 text-right" style={{display: "flex", flexDirection: "row-reverse", columnGap: "5px"}}>
            <Button size="sm" variant="light" className="btn-svg">
              <FaTimes/> Clear
            </Button>
            <Button size="sm" variant="secondary" className="btn-svg">
              <FaFilter/> Filter
            </Button>
          </div>
        </>}
      </div>
    )
  }
}

let wrapped = ContestSubFilterSidebar;
const mapStateToProps = state => {
  return {
    user: state.user.user,
    profile: state.profile.profile,
    contestSubFilter: state.contestSubFilter,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setParams: (params) => dispatch(setParams(params)),
    clearParams: () => dispatch(clearParams()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(wrapped);
