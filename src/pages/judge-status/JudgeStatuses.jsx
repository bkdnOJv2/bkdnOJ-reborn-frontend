import React from 'react';
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';
import { Table } from 'react-bootstrap';

import { SpinLoader, ErrorBox } from 'components';
import judgeAPI from 'api/judge';
import { setTitle } from 'helpers/setTitle';

import './JudgeStatuses.scss'
import 'styles/ClassicPagination.scss';

class JudgeStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startTime: this.props.startTime,
      upTime: 'N/A',
    }
  }

  componentDidMount() {
    this.updateUptime();
    this.timer = setInterval(() => this.updateUptime(), 3000)
  }
  componentWillUnmount() {
    clearInterval(this.timer)
  }

  updateUptime() {
    if (!this.state.startTime) return "N/A";
    let diffMs = (new Date()) - (new Date(this.state.startTime));
    let diffS = Math.floor(diffMs / 1000)
    let diffM = Math.floor(diffS / 60);
    diffS %= 60;
    let diffH = Math.floor(diffM / 60);
    diffM %= 60;
    let diffD = Math.floor(diffH / 24);
    diffH %= 24;
    const msg = (diffD > 0 ? `${diffD} day(s), ` : "") +
      (diffH > 0 ? `${diffH} hour(s), ` : "") +
      (diffM > 0 ? `${diffM} min(s), ` : "") +
      (diffS > 0 ? `${diffS} sec(s), ` : "");
    if (msg.length > 2) {
      this.setState({upTime: msg.substring(0, msg.length - 2)})
    }
  }

  render() {
    const {id, name, is_blocked, online, ping, load, description} = this.props;
    return (
      <tr>
        <td className="text-truncate" style={{maxWidth: "100px"}}>
          {id}
        </td>
        <td className="text-truncate" style={{maxWidth: "300px"}}>
          {name}
        </td>
        <td>{online ? "✔️" : "❌"}</td>
        <td>{is_blocked ? "✔️" : "❌"}</td>
        <td>{this.state.upTime}</td>
        <td>{load}</td>
        <td>{description}</td>
      </tr>
    )
  }
}

class JudgeStatuses extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      judges: [],
      currPage: 0,
      pageCount: 1,
      loaded: false,
      errors: null,
    }
    setTitle('Judges')
  }

  callApi(params) {
    this.setState({loaded: false, errors: null})

    judgeAPI.getJudges({page: params.page+1})
      .then((res) => {
        this.setState({
          judges: res.data.results,
          count: res.data.count,
          pageCount: res.data.total_pages,
          currPage: params.page,
          loaded: true,
        })
      })
      .catch((err) => {
        this.setState({
          loaded: true,
          errors: ["Cannot fetch judge statuses. Please retry again."],
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
    let avaiRuntime = []
    this.state.judges.map((item, idx) => {
      avaiRuntime = avaiRuntime.concat(item.runtimes)
    })
    avaiRuntime = avaiRuntime.filter((val, ind, self) => self.indexOf(val) === ind)
    return (
      <>
      <div className="judge-table">
        <h4>Judge Status</h4>
        <ErrorBox errors={this.state.errors} />
        <Table responsive hover size="sm" striped bordered className="rounded">
          <thead>
            <tr>
              <th >#</th>
              <th >Name</th>
              <th >Online?</th>
              <th >Blocked?</th>
              <th >Up Time</th>
              <th >Load</th>
              <th >Description</th>
            </tr>
          </thead>
          <tbody>
            {
              this.state.loaded === false
                ? <tr><td colSpan="7"><SpinLoader margin="10px" /></td></tr>
                : this.state.judges.map((item, idx) => <JudgeStatus
                    key={`judge-${item.id}`}
                    rowid={idx} startTime={item.start_time} {...item}
                  />)
            }
          </tbody>
          <tfoot className="judge-table-footer">
            <tr><td colSpan="7">
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
            </td></tr>
          </tfoot>
        </Table>
      </div>

      <div className="judge-table text-left">
        <h4>Available Runtime</h4>
        <ul>
          {
            avaiRuntime.map((runtime, idx) => <li key={idx}>{runtime}</li>)
          }
        </ul>
      </div>
      </>
    )
  }
}

export default JudgeStatuses;