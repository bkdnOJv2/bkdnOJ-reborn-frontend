import React from 'react';

import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';
import { Table } from 'react-bootstrap';
import { VscPerson } from 'react-icons/vsc';

import { SpinLoader, ErrorBox } from 'components';
import contestAPI from 'api/contest';
import { setTitle } from 'helpers/setTitle';
import { getDuration } from 'helpers/durationFormatter';

import './List.scss'
import 'styles/ClassicPagination.scss';

class ContestListItem extends React.Component {
  constructor(props){
    super(props);
  }

  parseStartTime() {
    if (this.props.data.start_time) 
      return (
        <span>{new Date(this.props.data.start_time).toLocaleString()}
          <div style={{fontSize: "10px"}}>UTC{this.props.data.start_time.substring(19)}</div>
        </span>
      )
    return 'Chưa công bố';
  }
  parseDuration() {
    if (this.props.data.time_limit) return this.props.data.time_limit;
    return getDuration(this.props.data.start_time, this.props.data.end_time)
  }
  parseParticipation() {
    const type = this.props.type;
    if (type === 'active') {
      return 
    }
  }

  render() {
    const ckey = this.props.data.key;
    const cname = this.props.data.name;
    const type = this.props.type;

    return (
      <tr>
        <td className="text-truncate" style={{maxWidth: "100px"}}>
          <Link to={`/contest/${ckey}`}>{ckey}</Link>
        </td>
        <td className="text-truncate" style={{maxWidth: "300px"}}>
          <Link to={`/contest/${ckey}`}>{cname}</Link>
        </td>
        <td>{this.parseStartTime()}</td>
        <td>{this.parseDuration()}</td>
        <td id="participate-options">{ 
          <div className="text-center d-flex flex-column align-items-center" style={{width: "100%"}}>
            <span className="d-inline-flex align-items-center">
              Participants: {this.props.data.user_count}<VscPerson size={16}/>
            </span>
            {
              type === 'active' && <>
                <span className="d-inline-flex align-items-center">
                  <Link to={`/contest/${ckey}`}>{`Continue >>`}</Link>
                </span>
              </>
            }

            {
              type === 'present' && <>
                <span className="d-inline-flex align-items-center">
                  <Link to={`/contest/${ckey}`}>{`Participate >>`}</Link>
                </span>
                <span className="d-inline-flex align-items-center">
                  <Link to={`/contest/${ckey}`}>{`Standing >>`}</Link>
                </span>
              </>
            }

            {
              type === 'past' && <>
                <span className="d-inline-flex align-items-center">
                  <Link to={`/contest/${ckey}`}>{`Standing >>`}</Link>
                </span>
              </>
            }
          </div>
        }</td>
      </tr>
    )
  }
}

class NPContestList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contest: [],
      loaded: false,
      errors: null,
    }
  }

  callApi(params) {
    this.setState({loaded: false, errors: null})

    contestAPI.getContests()
      .then((cont) => {
        this.setState({
          contests: cont.data,
          loaded: true,
        })
      })
      .catch((err) => {
        this.setState({
          loaded: true,
          errors: ["Cannot fetch contests. Please retry again."],
        })
      })
  }

  componentDidMount() {
    this.callApi({page: this.state.currPage});
  }

  render() {
    return (
      <div className="npast-contest">
          <h4>Ongoing/Upcoming Contests</h4>
          <ErrorBox errors={this.state.errors} />
          <Table responsive hover size="sm" striped bordered className="rounded">
          <thead>
            <tr>
              <th style={{width: "13%"}}>#</th>
              <th style={{width: "30%"}}>Name</th>
              <th style={{width: "15%"}}>Start Time</th>
              <th style={{width: "8%"}}>Duration</th>
              <th style={{width: "20%"}}>Participate</th>
            </tr>
          </thead>
          <tbody>
              { this.state.loaded === false && <tr><td colSpan="6"><SpinLoader margin="10px" /></td></tr> }
              { this.state.loaded === true && 
                  <>
                      { 
                          this.state.contests.active.map((cont, idx) => 
                              <ContestListItem key={`cont-${cont.key}`} rowid={idx} data={cont} type="active" /> 
                          )
                      }
                      { 
                          this.state.contests.present.map((cont, idx) => 
                              <ContestListItem key={`cont-${cont.key}`} rowid={idx} data={cont} type="present"/> 
                          )
                      }
                      { 
                          this.state.contests.future.map((cont, idx) => 
                              <ContestListItem key={`cont-${cont.key}`} rowid={idx} data={cont} type="future"/> 
                          )
                      }
                  </>
              }
          </tbody>
          </Table>
      </div>
    )
  }

}

class ContestList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pastContests: [],
      currPage: 0,
      pageCount: 1,

      loaded: false,
      errors: null,
    }
    setTitle('Contests')
  }

  callApi(params) {
    this.setState({loaded: false, errors: null})

    contestAPI.getPastContests({page: params.page+1})
      .then((pastcont) => {
        this.setState({
          pastContests: pastcont.data.results,
          count: pastcont.data.count,
          pageCount: pastcont.data.total_pages,
          currPage: params.page,
          loaded: true,
        })
      })
      .catch((err) => {
        this.setState({
          loaded: true,
          errors: ["Cannot fetch contests. Please retry again."],
        })
      })
  }

  componentDidMount() {
    this.callApi({page: this.state.currPage});
  }

  handlePageClick = (event) => {
    this.callApi({page: event.selected});
  }

  render() {
    return (
      <div className="contest-table">
        <NPContestList />

        <hr className="m-2" />

        <div className="past-contest">
            <h4>Past Contests</h4>
            <ErrorBox errors={this.state.errors} />
            <Table responsive hover size="sm" striped bordered className="rounded">
            <thead>
              <tr>
                <th style={{width: "13%"}}>#</th>
                <th style={{width: "30%"}}>Name</th>
                <th style={{width: "15%"}}>Start Time</th>
                <th style={{width: "8%"}}>Duration</th>
                <th style={{width: "20%"}}>Participate</th>
              </tr>
            </thead>
            <tbody>
              { this.state.loaded === false && <tr><td colSpan="6"><SpinLoader margin="10px" /></td></tr> }
              { this.state.loaded === true && 
                <>
                  { 
                    this.state.pastContests.map((cont, idx) => 
                      <ContestListItem key={`cont-${cont.key}`} rowid={idx} data={cont} type="past" /> 
                    )
                  }
                </>
              }
            </tbody>
            </Table>
            {
            this.state.loaded === false
                ? <SpinLoader margin="0" />
                : <span className="classic-pagination">Page: <ReactPaginate
                    breakLabel="..."
                    onPageChange={this.handlePageClick}
                    forcePage={this.state.currPage}
                    pageLabelBuilder={(page) => `[${page}]`}
                    pageRangeDisplayed={3}
                    pageCount={this.state.pageCount}
                    renderOnZeroPageCount={null}
                    previousLabel={null}
                    nextLabel={null}
                    /></span>
            }
        </div>
      </div>
    )
  }
}

export default ContestList;
