import React from 'react';
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';
import { Table } from 'react-bootstrap';
// import { FaPaperPlane } from 'react-icons/fa';

import { SpinLoader, ErrorBox } from 'components';

import problemApi from 'api/problem';
import contestApi from 'api/contest';

import { setTitle } from 'helpers/setTitle';
import { withParams } from 'helpers/react-router'

// Contexts
import ContestContext from 'context/ContestContext';

// Styles
import './ProblemList.scss'
import 'styles/ClassicPagination.scss';

class ProblemListItem extends React.Component {
  render() {
    const {shortname, title, solved_count, attempted_count, points} = this.props;
    return (
      <tr>
        <td className="text-truncate" style={{maxWidth: "100px"}}>
          <Link to={`/problem/${shortname}`}>{shortname}</Link>
        </td>
        <td className="text-truncate" style={{maxWidth: "300px"}}>
          <Link to={`/problem/${shortname}`}>{title}</Link>
        </td>
        <td>{points}</td>
        <td>{solved_count}</td>
        <td>{attempted_count === 0 ? '?' : `${(solved_count*100.0/attempted_count).toFixed(2)}%`}</td>
        <td>
          {/* <Link to={`/problem/${shortname}/submit`}><FaPaperPlane/></Link> */}
        </td>
      </tr>
    )
  }
}

class ProblemList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      problems: [],

      currPage: 0,
      pageCount: 1,

      loaded: false,
      errors: null,
    }
    setTitle('Problems')
  }

  callApi(params) {
    this.setState({loaded: false, errors: null})

    let endpoint, data;
    if (this.state.contest) {
      endpoint = contestApi.getContestProblems
      data = { key: this.state.contest.key }
    } else {
      endpoint = problemApi.getProblems
      data = {}
    }

    endpoint({...data, params: {page: params.page+1,} })
      .then((res) => {
        this.setState({
          problems: res.data.results,
          count: res.data.count,
          pageCount: res.data.total_pages,
          currPage: params.page,
          loaded: true,
        })
      })
      .catch((err) => {
        this.setState({
          loaded: true,
          errors: ["Cannot fetch problems. Please retry again."],
        })
      })
  }

  componentDidMount() {
    const contest = this.context.contest;
    if (contest) {
      setTitle(`Contest. ${contest.name} | Problems`)
      this.setState({ contest }, 
        () => this.callApi({page: this.state.currPage})
      )
    } else this.callApi({page: this.state.currPage})
  }

  handlePageClick = (event) => {
    this.callApi({page: event.selected});
  }

  render() {
    const contest = this.context.contest;

    return (
      <div className="problem-table">
        <h4>Problem Set</h4>
        <ErrorBox errors={this.state.errors} />
          <Table responsive hover size="sm" striped bordered className="rounded">
            <thead>
              <tr>
                <th style={{width: "20%"}}>#</th>
                <th style={{minWidth: "30%", maxWidth: "50%"}}>Title</th>
                <th style={{width: "12%"}}>Points</th>
                <th style={{width: "10%"}}>Solved</th>
                <th style={{width: "10%"}}>AC%</th>
                <th style={{width: "5%"}}></th>
              </tr>
            </thead>
            <tbody>
              { this.state.loaded === false && <tr><td colSpan="6"><SpinLoader margin="10px" /></td></tr> }
              { this.state.loaded === true && 
                <>
                  {
                  this.state.problems.map((prob, idx) => <ProblemListItem
                      key={`prob-${prob.shortname}`}
                      rowid={idx} {...prob}
                    />)
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
    )
  }
}
ProblemList.contextType = ContestContext;

let wrapped = ProblemList;
wrapped = withParams(wrapped);

export default wrapped;
