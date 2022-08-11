import React from 'react';

// Redux
import { connect } from 'react-redux';
import { setParams, clearParams } from 'redux/ContestSubFilter/actions';

import { Button, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { ErrorBox, SpinLoader } from 'components';
import ContestContext from 'context/ContestContext';

// Helpers
import { getHourMinuteSecond, getYearMonthDate } from 'helpers/dateFormatter';

import './ContestSubFilterSidebar.scss';

const LANGUAGES = [
    {
      "key": "C",
      "name": "C",
  },
  {
      "key": "C11",
      "name": "C11",
  },
  {
      "key": "CPP03",
      "name": "C++03",
  },
  {
      "key": "CPP11",
      "name": "C++11",
  },
  {
      "key": "CPP14",
      "name": "C++14",
  },
  {
      "key": "CPP17",
      "name": "C++17",
  },
  {
      "key": "CPP20",
      "name": "C++20",
  },
  {
      "key": "JAVA8",
      "name": "Java 8",
  },
  {
      "key": "PAS",
      "name": "Pascal",
  },
  {
      "key": "PY2",
      "name": "Python 2",
  },
  {
      "key": "PY3",
      "name": "Python 3",
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

    console.log(contest)

    return (
      <div className="wrapper-vanilla" id="recent-submission-sidebar">
        <h4>Submissions Filter</h4>
        { !user && <span><Link to='/sign-in'>Log in</Link> to see</span> }
        { !!user && !contest && <span>Contest is not available.</span> }
        { !!user && !!contest && <>

          <div className="d-flex pl-3 pr-3 text-left">
              <label id="problem-select-lbl" className="m-0" for="only-me">Problem</label>
              <select id="problem-select">
              </select>

              <label id="problem-select-lbl" className="m-0" for="only-me">Language</label>
              <select id="problem-select">
                <option key={`ct-fltr-ln-df`} defaultValue>--</option>
                { LANGUAGES.map((l, idx) =>
                  <option key={`ct-fltr-ln-${idx}`} value={l.value}>{l.name}</option>
                ) }
              </select>

              <label id="problem-select-lbl" className="m-0" for="only-me">Verdict</label>
              <select id="problem-select">
                <option key={`ct-fltr-vd-df`} defaultValue>--</option>
                { VERDICTS.map((v, idx) =>
                  <option key={`ct-fltr-vd-${idx}`} value={v.value}>{v.name}</option>
                ) }
              </select>

              <label id="only-me-lbl" className="d-flex align-items-center m-0">
                <input type="checkbox" id="only-me"></input>
                <span style={{flex: 2}}>Only me</span>
              </label>
          </div>
          <div className="p-1 text-right" style={{display: "flex", flexDirection: "row", columnGap: "5px"}}>
            <Button size="sm" variant="secondary">Filter</Button>
            <Button size="sm" variant="light">Clear</Button>
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
