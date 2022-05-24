import React from 'react';
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';
import { Button, Table } from 'react-bootstrap';
import { FaPaperPlane } from 'react-icons/fa';

import { SpinLoader, ErrorBox } from 'components';
import problemApi from 'api/problem';
import { setTitle } from 'helpers/setTitle';

import './AdminProblemList.scss'
import 'styles/ClassicPagination.scss';

class ProblemListItem extends React.Component {
  render() {
    const {shortname, title, points, is_published, is_privated_to_orgs} = this.props;
    const {rowidx, selectChk, onSelectChkChange} = this.props;

    return (
      <tr>
        <td className="text-truncate" style={{maxWidth: "80px"}}>
          {shortname}
        </td>
        <td className="text-truncate" style={{maxWidth: "200px"}}>
          {title}
        </td>
        <td>{points}</td>
        <td>{is_published ? "Yes" : "No"}</td>
        <td>{is_privated_to_orgs ? "Yes" : "No"}</td>
        <td>
            <Link to={`/admin/problem/${shortname}`}>Edit</Link>
        </td>
        <td>
            <input type="checkbox" value={selectChk[rowidx]}
              onChange={(e) => onSelectChkChange(rowidx)}
            />
        </td>
      </tr>
    )
  }
}

class AdminProblemList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      problems: [],
      selectChk: [],
      currPage: 0,
      pageCount: 1,
      loaded: false,
      errors: null,
    }
    setTitle('Admin | Problems')
  }

  selectChkChangeHandler(idx) {
    const {selectChk} = this.state;
    if (idx >= selectChk.length)
      console.log('Invalid delete tick position');
    else {
      const val = selectChk[idx];
      this.setState({
        selectChk: selectChk.slice(0, idx).concat(!val, selectChk.slice(idx+1))
      })
    }
  }

  callApi(params) {
    this.setState({loaded: false, errors: null})

    problemApi.getProblems({page: params.page+1})
      .then((res) => {
        this.setState({
          problems: res.data.results,
          count: res.data.count,
          pageCount: res.data.total_pages,
          currPage: params.page,
          loaded: true,
          selectChk: Array(res.data.results.length).fill(false),
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
    this.callApi({page: this.state.currPage});
  }

  handlePageClick = (event) => {
    this.callApi({page: event.selected});
  }

  handleDeleteSelect(e) {
    e.preventDefault();

    let names = [];
    this.state.selectChk.forEach((v, i) => {
      if (v) names.push(this.state.problems[i].shortname)
    })

    const conf = window.confirm('Xóa các bài tập ' + JSON.stringify(names) + ' ?');
    if (conf) {
      let reqs = []
      names.forEach((shortname) => {
        reqs.push( problemApi.adminDeleteProblem({shortname}) )
      })

      Promise.all(reqs).then((res) => {
        console.log(res)
        this.callApi({page: this.state.currPage});
      }).catch((err) => {
        let msg = 'Cannot delete selected problems. Maybe someone else has done it for you?';
        if (err.response) {
          if (err.response.status === 404)
            msg = 'Cannot find such problems. Maybe it has been removed?.';
          if ([403, 401].includes(err.response.status))
            msg = 'Not authorized.';
        }
        this.setState({ errors: [msg] })
      })
    }
  }

  render() {
    return (
      <>
      <div className="admin-options">
        <Button size="sm" onClick={(e)=>alert('Create new')}>Create (Form)</Button>
        <Button size="sm" onClick={(e)=>alert('Upload zip')}>Create (Upload Zip)</Button>
      </div>

      <div className="admin-table problem-table">
        <h4>Problem List</h4>
        <ErrorBox errors={this.state.errors} />
        <Table responsive hover size="sm" striped bordered className="rounded">
          <thead>
            <tr>
              <th style={{width: "20%"}}>#</th>
              <th style={{minWidth: "30%", maxWidth: "30%"}}>Title</th>
              <th style={{width: "12%"}}>Points</th>
              <th style={{width: "10%"}}>Public?</th>
              <th style={{width: "10%"}}>Orgs Limited?</th>
              <th style={{width: "5%"}}>Edit</th>
              <th style={{width: "8%"}}>
                <Link to="#" onClick={(e) => this.handleDeleteSelect(e)}>Delete</Link>
              </th>
            </tr>
          </thead>
          <tbody>
            {
              this.state.loaded === false
                ? <tr><td colSpan="7"><SpinLoader margin="10px" /></td></tr>
                : this.state.problems.map((prob, idx) => <ProblemListItem
                    key={`prob-${prob.shortname}`}
                    rowidx={idx} {...prob}
                    selectChk={this.state.selectChk}
                    onSelectChkChange={(i) => this.selectChkChangeHandler(i)}
                  />)
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
      </>
    )
  }
}

export default AdminProblemList;
