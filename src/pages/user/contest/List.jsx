import React from 'react';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';

import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';
import { Table } from 'react-bootstrap';
import { VscPerson, VscError } from 'react-icons/vsc';

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

  isInContest(ckey) {
    const { profile } = this.props;
    console.log(profile)
    if (!profile || !profile.current_contest ) return false;
    if (profile.current_contest.contest.key !== ckey) return false;
    return true;
  }
  isParticipant(ckey) {
    if (! this.isInContest(ckey) ) return false;
    const { profile } = this.props;
    return profile.current_contest.virtual === 0;
  }
  isSpectator(ckey) {
    if (! this.isInContest(ckey) ) return false;
    const { profile } = this.props;
    return profile.current_contest.virtual === -1;
  }

  registerContest(ckey) {
    const conf = window.confirm(`Đăng ký cuộc thi "${ckey}"? Sau khi đăng ký, bạn có thể nộp bài và xuất hiện trên bảng xếp hạng.`)
    if (!conf) return false;
    contestAPI.joinContest({key : ckey})
    .then((res) => {
      toast.success(`Đăng ký contest ${ckey} thành công.`, { toastId: 'contest-registered' })
    })
    .catch((err) => {
      const msg = (err.response && err.response.data && err.response.data.detail) || `Đăng ký contest "${ckey}" thất bại.`
      toast.error(msg, {toastId: 'contest-register-failed'})
    })
    .finally(() => this.props.refetch && this.props.refetch())
  }

  render() {
    const ckey = this.props.data.key;
    const cname = this.props.data.name;
    const { spectate_allow, is_registered } = this.props.data;
    const type = this.props.type;
    const { user } = this.props;

    return (
      <tr>
        <td className="text-truncate" style={{maxWidth: "100px"}}>
          <Link to={`/contest/${ckey}`}>{ckey}</Link>
        </td>
        <td className="text-truncate" style={{maxWidth: "300px"}}>
          <Link to={`/contest/${ckey}`}>{cname}</Link>
        </td>
        <td className="contest-start">{this.parseStartTime()}</td>
        <td>{this.parseDuration()}</td>
        <td className="participate-options">{
          <div className="text-center d-flex flex-column align-items-center" style={{width: "100%"}}>
            <div className="flex-center">
              Participants: {this.props.data.user_count}<VscPerson size={18}/>
            </div>
            {
              /* Active: Present contest that has Live Participation of user */
              type === 'active' && <>
                {
                  <div className="flex-center">
                    <span className="active-continue-label">
                      <Link to={`/contest/${ckey}`}>
                        {`Continue >>`}
                      </Link>
                    </span>
                    {/* <span style={{width: "5px"}}></span>
                    <Link to='#' onClick={(e) => this.leaveContest(ckey)}>
                      <VscError size={14} color="red" style={{verticleAlign: "middle"}}/>
                    </Link> */}
                  </div>
                }
                <span className="d-inline-flex align-items-center">
                  <Link to={`/contest/${ckey}/standing`}>{`Current Standing >>`}</Link>
                </span>
              </>
            }

            {
              /* Active: Present contest that doesnt have Live Participation of user */
              type === 'present' && <>
                { user && (
                    spectate_allow ? <span className="d-inline-flex align-items-center">
                      <Link to={`/contest/${ckey}`}>{`Spectate >>`}</Link>
                    </span> : <span className="d-inline-flex align-items-center">
                      <Link to="#" onClick={() => this.registerContest(ckey)}>{`Register >>`}</Link>
                    </span>
                  )
                }
                { !user && <span className="d-inline-flex align-items-center">
                    <Link to={`/sign-in`}>{`Log in to Participate >>`}</Link>
                </span> }
                <span className="d-inline-flex align-items-center">
                  <Link to={`/contest/${ckey}/standing`}>{`Current Standing >>`}</Link>
                </span>
              </>
            }

            {
              type === 'past' && <>
                <span className="d-inline-flex align-items-center">
                  <Link to={`/contest/${ckey}/standing`}>{`Standing >>`}</Link>
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
              <th className="contest-start">When</th>
              <th style={{width: "8%"}}>Duration</th>
              <th className="participate-options">Participate</th>
            </tr>
          </thead>
          <tbody>
              { this.state.loaded === false && <tr><td colSpan="6"><SpinLoader margin="10px" /></td></tr> }
              { this.state.loaded === true && !this.state.errors &&
                  <>
                      {
                          this.state.contests.active.map((cont, idx) =>
                              <ContestListItem key={`cont-${cont.key}`} rowid={idx} data={cont}
                              user={this.props.user} profile={this.props.profile}
                              refetch={() => this.callApi()}
                              type="active" />
                          )
                      }
                      {
                          this.state.contests.present.map((cont, idx) =>
                              <ContestListItem key={`cont-${cont.key}`} rowid={idx} data={cont}
                              user={this.props.user} profile={this.props.profile}
                              refetch={() => this.callApi()}
                              type="present"/>
                          )
                      }
                      {
                          this.state.contests.future.map((cont, idx) =>
                              <ContestListItem key={`cont-${cont.key}`} rowid={idx} data={cont}
                              user={this.props.user} profile={this.props.profile}
                              refetch={() => this.callApi()}
                              type="future"/>
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
      <div className="contest-table wrapper-vanilla">
        <NPContestList {...this.props} />

        <hr className="m-2" />

        <div className="past-contest">
          <h4>Past Contests</h4>
          <ErrorBox errors={this.state.errors} />
          <Table responsive hover size="sm" striped bordered className="rounded">
          <thead>
            <tr>
              <th style={{width: "13%"}}>#</th>
              <th style={{width: "30%"}}>Name</th>
              <th className="contest-start">When</th>
              <th style={{width: "8%"}}>Duration</th>
              <th className="participate-options">Participate</th>
            </tr>
          </thead>
          <tbody>
            { this.state.loaded === false && <tr><td colSpan="6"><SpinLoader margin="10px" /></td></tr> }
            { this.state.loaded === true &&
              <>
                {
                  this.state.pastContests.map((cont, idx) =>
                    <ContestListItem key={`cont-${cont.key}`} rowid={idx} data={cont} user={this.props.user} type="past" />
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

let wrapped = ContestList;
const mapStateToProps = state => {
  return {
    user: state.user.user,
    profile: state.profile.profile,
  }
}
export default connect(mapStateToProps, null)(wrapped);
