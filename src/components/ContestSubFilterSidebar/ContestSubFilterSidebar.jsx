import React from "react";

// Redux
import {connect} from "react-redux";
import {setParams, clearParams} from "redux/ContestSubFilter/actions";

import {Button, Table, Row, Col} from "react-bootstrap";
import {Link} from "react-router-dom";

import {ErrorBox, SpinLoader} from "components";
import ContestContext from "context/ContestContext";

// Helpers
import {getHourMinuteSecond, getYearMonthDate} from "helpers/dateFormatter";

// Assets
import {FaTimes, FaFilter} from "react-icons/fa";

import "./ContestSubFilterSidebar.scss";

const LANGUAGES = [
  {
    key: "C",
    name: "C",
  },
  {
    key: "C++",
    name: "C++",
  },
  {
    key: "Java",
    name: "Java",
  },
  {
    key: "Pascal",
    name: "Pascal",
  },
  {
    key: "Python",
    name: "Python",
  },
];
const VERDICTS = [
  {
    value: "AC",
    name: "Accepted",
  },
  {
    value: "WA",
    name: "Wrong Answer",
  },
  {
    value: "TLE",
    name: "Time Limit Exceeded",
  },
  {
    value: "MLE",
    name: "Memory Limit Exceeded",
  },
  {
    value: "RTE",
    name: "Runtime Error",
  },
  {
    value: "CE",
    name: "Compile Error",
  },
];

class ContestSubFilterSidebar extends React.Component {
  static contextType = ContestContext;

  constructor(props) {
    super(props);
    this.state = {
      queryParams: {},
    };
  }

  setParams(key, value) {
    console.log(key, value)
    if (value) {
      const oldParams = this.state.queryParams;
      this.setState({queryParams: {...oldParams, [key]: value}});
    } else {
      let newParams = {...this.state.queryParams};
      delete newParams[key];
      this.setState({queryParams: newParams});
    }
  }

  onFilter() {
    this.props.setParams(this.state.queryParams);
  }
  onClear() {
    this.setState({queryParams: {}});
    this.props.clearParams();
  }

  componentDidMount() {}
  componentDidUpdate() {}

  render() {
    console.log(this.state.queryParams)

    const {contest} = this.context;
    const {user} = this.props;

    const problems = contest.problems || [];

    const isLoggedIn = !!user;
    const isStaff = isLoggedIn && user.is_staff;
    const isSuperuser = isStaff && user.is_superuser;

    return (
      <div className="wrapper-vanilla" id="contest-sub-filter">
        <h4>Submissions Filter</h4>
        {!contest && <span>Contest is not available.</span>}
        {!!contest && (
          <>
            <div className="flex-center-col text-left filter-panel">
              <Row>
                <Col>
                  <label
                    id="problem-select-lbl"
                    className="m-0 w-100"
                    htmlFor="only-me"
                  >
                    Problem
                  </label>
                  <select
                    id="problem-select"
                    className="m-0 w-100"
                    onChange={e => this.setParams("problem", e.target.value)}
                    value={this.state.queryParams.problem || ""}
                  >
                    <option key={`ct-fltr-pr-df`} value="">
                      --
                    </option>
                    {problems.map((p, idx) => (
                      <option
                        key={`ct-fltr-pr-${idx}`}
                        value={p.shortname}
                      >{`${p.label}. ${p.title}`}</option>
                    ))}
                  </select>
                </Col>
              </Row>
              <Row>
                <Col xs={4}>
                  <label
                    id="language-select-lbl"
                    className="m-0 w-100"
                    htmlFor="only-me"
                  >
                    Lang
                  </label>
                  <select
                    id="language-select"
                    className="m-0 w-100"
                    onChange={e => this.setParams("language", e.target.value)}
                    value={this.state.queryParams.language || ""}
                  >
                    <option key={`ct-fltr-ln-df`} value="">
                      --
                    </option>
                    {LANGUAGES.map((l, idx) => (
                      <option key={`ct-fltr-ln-${idx}`} value={l.value}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </Col>
                <Col xs={8}>
                  <label
                    id="verdict-select-lbl"
                    className="m-0 w-100"
                    htmlFor="only-me"
                  >
                    Verdict
                  </label>
                  <select
                    id="verdict-select"
                    className="m-0 w-100"
                    onChange={e => this.setParams("verdict", e.target.value)}
                    value={this.state.queryParams.verdict || ""}
                  >
                    <option key={`ct-fltr-vd-df`} value="">
                      --
                    </option>
                    {VERDICTS.map((v, idx) => (
                      <option key={`ct-fltr-vd-${idx}`} value={v.value}>
                        {v.name}
                      </option>
                    ))}
                    {
                      isStaff && <option key={`ct-fltr-vd-ie`} value={"IE"} className="text-danger">
                        Internal Error
                      </option>
                    }
                  </select>
                </Col>
              </Row>
              <div className="w-100 checkbox-panel" style={{columnGap: "5px"}}>
                {isLoggedIn && (
                  <label
                    id="only-me-lbl"
                    className="d-flex align-items-center m-0"
                  >
                    <input
                      type="checkbox"
                      id="only-me"
                      className="ml-1 mr-1"
                      checked={this.state.queryParams.me || false}
                      onChange={() =>
                        this.setParams("me", !this.state.queryParams.me)
                      }
                    ></input>
                    <span style={{flex: 2}}>Mine</span>
                  </label>
                )}
                {isStaff && (
                  <>
                    <label
                      id="only-participants-lbl"
                      className="d-flex align-items-center m-0"
                    >
                      <input
                        type="checkbox"
                        id="only-participant"
                        className="ml-1 mr-1"
                        checked={this.state.queryParams.participants || false}
                        onChange={() =>
                          this.setParams(
                            "participants",
                            !this.state.queryParams.participants
                          )
                        }
                      ></input>
                      <span className="text-danger" style={{flex: 2}}>
                        Participants
                      </span>
                    </label>
                    <label
                      id="only-participants-lbl"
                      className="d-flex align-items-center m-0"
                    >
                      <input
                        type="checkbox"
                        id="only-participant"
                        className="ml-1 mr-1"
                        checked={this.state.queryParams.spectators || false}
                        onChange={() =>
                          this.setParams(
                            "spectators",
                            !this.state.queryParams.spectators
                          )
                        }
                      ></input>
                      <span className="text-danger" style={{flex: 2}}>
                        Spectators
                      </span>
                    </label>
                  </>
                )}
              </div>
            </div>

            <div
              className="p-1 text-right"
              style={{
                display: "flex",
                flexDirection: "row-reverse",
                columnGap: "5px",
              }}
            >
              <Button
                size="sm"
                variant="light"
                className="btn-svg"
                onClick={() => this.onClear()}
              >
                <FaTimes /> Clear
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="btn-svg"
                onClick={() => this.onFilter()}
              >
                <FaFilter /> Filter
              </Button>
            </div>
          </>
        )}
      </div>
    );
  }
}

let wrapped = ContestSubFilterSidebar;
const mapStateToProps = state => {
  return {
    user: state.user.user,
    profile: state.profile.profile,
    contestSubFilter: state.contestSubFilter,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setParams: params => dispatch(setParams(params)),
    clearParams: () => dispatch(clearParams()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(wrapped);
