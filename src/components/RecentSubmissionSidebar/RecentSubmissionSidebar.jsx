import React from 'react';
import { connect } from 'react-redux';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import contestAPI from 'api/contest';

import { ErrorBox, SpinLoader } from 'components';
import ContestContext from 'context/ContestContext';

import dateFormatter from 'helpers/dateFormatter';

class RSubItem extends React.Component {
  parseTime(time) {
    if (time === 0) return "0 ms";
    if (!time) return "N/A";
    return `${(time*1000).toFixed(0)} ms`
  }
  parseMemory(mem) {
    if (mem === 0) return "0 KB";
    if (!mem) return "N/A";
    if (mem > 65535)
      return `${(mem+1023)/1024} MB`
    return `${mem} KB`
  }
  parseDate(date) {
    return dateFormatter(date);
  }
  render() {
    const {id, problem, user, status, result, time, memory, date} = this.props;
    const verdict = (status === "D" ? result : status);

    return (
      <tr>
        <td className="text-truncate">
          <Link to={`submission/${id}`}>{id}</Link>
        </td>
        <td className="text-truncate">
          <Link to={`problem/${problem.shortname}`}>{problem.shortname}</Link>
        </td>

        {
          <td className={`verdict ${verdict.toLowerCase()}`}>
            <span>{verdict}</span>
          </td>
        }

        <td>{this.parseTime(time)}</td>
        <td>{this.parseMemory(memory)}</td>
        <td >{this.parseDate(date)}</td>
      </tr>
    )
  }
}

class RecentSubmissionSidebar extends React.Component {
  static contextType = ContestContext;
  constructor(props) {
    super(props);
    this.state = {
      subs: [],
      loaded: false,
      errors: null,
      contest: null,
      user: null,
    }
  }

  refetch() {
    this.setState({ loaded: false, errors: null })
    contestAPI.getContestSubmissions({ key: this.state.contest.key })
      .then((res) => {
        this.setState({
          loaded: true,
          subs: res.data.results, // first page only
        })
        console.log(res);
      })
      .catch((err) => {
        this.setState({
          loaded: true,
          errors: err,
        })
      })
  }

  componentDidUpdate(prevProps, prevState) {
    const { user } = this.props;
    const { contest } = this.context;
    if (!user || !contest) return; // skip if no user or no contest
    if (prevState.contest !== contest || prevState.user !== user) {
      this.setState({ user, contest }, () => this.refetch());
    }
  }

  render() {
    const { subs, loaded, user, contest } = this.state;

    return (
      <div className="flex-center wrapper-vanilla">
        <h4>Recent Submission</h4>
        { !user && <span><Link to='/sign-in'>Log in</Link> to see</span> }
        { !!user && !contest && <span>Contest is not available.</span> }
        { !!user && !!contest && !loaded && <SpinLoader margin="20px"/>}
        { !!user && !!contest && !!loaded && <>
          <ErrorBox errors={this.state.errors} />
          <Table responsive hover size="sm" striped bordered className="rounded">
            <thead>
              <tr>
                <th>#</th>
                <th>Problem</th>
                <th>Status</th>
                <th>Time</th>
                <th>Memory</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>{
              subs.map((sub, idx) => <RSubItem
                key={`recent-sub-${sub.id}`} rowid={idx} {...sub} />)
            }</tbody>
          </Table>
        </>}
      </div>
    )
  }
}

let wrapped = RecentSubmissionSidebar;
const mapStateToProps = state => {
  return {
    user: state.user.user,
    profile: state.profile.profile,
  }
}
export default connect(mapStateToProps, null)(wrapped);
