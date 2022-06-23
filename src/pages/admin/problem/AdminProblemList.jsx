import React from 'react';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';
import { Button, Table, Form, Modal } from 'react-bootstrap';

import { FaPaperPlane, FaRegFileArchive } from 'react-icons/fa';
import { AiOutlineForm, AiOutlineUpload, AiOutlineArrowRight, AiOutlinePlusCircle } from 'react-icons/ai';

import { SpinLoader, ErrorBox, FileUploader } from 'components';
import problemApi from 'api/problem';

import { setTitle } from 'helpers/setTitle';
import { qmClarify } from 'helpers/components';
import { withNavigation } from 'helpers/react-router';

import './AdminProblemList.scss'
import 'styles/ClassicPagination.scss';

class ProblemListItem extends React.Component {
  render() {
    const {shortname, title, points, short_circuit, is_public, is_organization_private} = this.props;
    const {rowidx, selectChk, onSelectChkChange} = this.props;

    const visible = is_public ? (
      is_organization_private ? "Orgs Only" : "Public"
    ) : "Private";

    return (
      <tr>
        <td className="text-truncate" style={{maxWidth: "80px"}}>
          <Link to={`/admin/problem/${shortname}`}>
            {shortname}
          </Link>
        </td>
        <td className="text-truncate" style={{maxWidth: "200px"}}>
          <Link to={`/admin/problem/${shortname}`}>
            {title}
          </Link>
        </td>
        <td>{points}</td>
        <td>{visible}</td>
        <td>{short_circuit ? "Yes" : "No"}</td>
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

      selectedZip: null,
      submitting: false,

      newModalShow: false,
    }
    setTitle('Admin | Problems')
  }

  setSelectedZip(zip) { this.setState({ selectedZip : zip }) }

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
          errors: (err.response.data || "Cannot fetch problems. Please retry again."),
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

    if (names.length === 0) {
      alert('Không có bài tập nào đang được chọn.');
      return;
    }

    // TODO: Write a bulk delete API for problems
    const conf = window.confirm('Xóa các bài tập ' + JSON.stringify(names) + '?');
    if (conf) {
      let reqs = []
      names.forEach((shortname) => {
        reqs.push( problemApi.adminDeleteProblem({shortname}) )
      })

      Promise.all(reqs).then((res) => {
        toast.success('OK Deleted.')
        this.callApi({page: this.state.currPage});
      }).catch((err) => {
        let msg = 'Không thể xóa các problem này.';
        if (err.response) {
          if (err.response.status === 405)
            msg += ' Phương thức chưa được implemented.';
          if (err.response.status === 404)
            msg = 'Không tìm thấy một trong số Problem được chọn. Có lẽ chúng đã bị xóa?'
          if ([403, 401].includes(err.response.status))
            msg += ' Có một vài Problem được chọn mà bạn không có quyền.';
        }
        this.setState({ errors: [msg] })
      })
    }
  }

  newModalToggle(bool) {
    this.setState({ newModalShow : bool })
  }

  render() {
    const {selectedZip, submitting} = this.state;

    return (
      <div className="admin admin-problems wrapper-vanilla">
      {/* Options for Admins: Create New,.... */}
      <div className="admin-options">
        <div className="border d-inline-flex p-1" >
        <Button size="sm"
          variant="dark" className="btn-svg"
          onClick={(e) => this.setState({newModalShow: true}) }
        >
          <AiOutlinePlusCircle />
          <span className="d-none d-md-inline-flex">Add (Form)</span>
          <span className="d-inline-flex d-md-none">
            <AiOutlineArrowRight/>
            <AiOutlineForm />
          </span>
        </Button>
        </div>

        <div className="border d-inline-flex p-1" >
          <FileUploader
            onFileSelectSuccess={(file) => this.setSelectedZip(file)}
            onFileSelectError={({ error }) => alert(error)}
          />
          <Button disabled={submitting}
            onClick={(e)=>{
              if (!selectedZip) alert("Please select a .zip file.");
              else {
                this.setState({submitting: true}, () => {
                  const formData = new FormData();
                  formData.append("archive", selectedZip);
                  problemApi.adminPostProblemFromZip({formData})
                    .then((res) => {
                      toast.success("Đã tạo Problem mới thành công.")
                      this.callApi({page: this.state.currPage});
                    })
                    .catch((err) => {
                      const data = err.response.data;
                      this.setState({ errors: data })
                    })
                    .finally(() => this.setState({submitting: false}))
                })
              }
            }}
            size="sm" variant="dark" className="btn-svg"
          >
            <AiOutlinePlusCircle />
            <span className="d-none d-md-inline-flex">Add (upload Zip)</span>
            <span className="d-inline-flex d-md-none">
              <AiOutlineArrowRight/>
              <FaRegFileArchive />
            </span>
          </Button>
        </div>
      </div>
      {/* Place for displaying information about admin actions  */}
      <div className="admin-note text-center mb-1">
        {
          submitting && <span className="loading_3dot">Đang xử lý yêu cầu</span>
        }
      </div>

      {/* Problem List */}
      <div className="admin-table problem-table">
        <h4>Problem List</h4>
        <ErrorBox errors={this.state.errors} />
        <Table responsive hover size="sm" striped bordered className="rounded">
          <thead>
            <tr>
              <th style={{width: "20%"}}>#</th>
              <th style={{minWidth: "30%", maxWidth: "30%"}}>Title</th>
              <th style={{width: "12%"}}>Points</th>
              <th style={{width: "10%"}}>
                Visible{qmClarify("Cho biết Problem này đang ở chế độ hiển thị nào.\n"+
                            "* Public: mọi người đều thấy\n* Orgs: Một vài tổ chức thấy được.\n"+
                            "* Private: Chỉ các cá nhân được thêm mới thấy được.")}
              </th>
              <th style={{width: "10%"}}>
                ICPC{qmClarify("Chạy bài ở chế độ ICPC, nghĩa là một test sai sẽ dừng quá trình chấm bài.")}
              </th>
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

      <NaviNewProb show={this.state.newModalShow} toggle={(b)=>this.newModalToggle(b)} />
      </div>
    )
  }
}

class NewProblemModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shortname: '',
      errors: null,
    }
  }
  onSubmit(e) {
    e.preventDefault();
    this.setState({ errors: null })

    problemApi.createProblem({ data: {shortname: this.state.shortname} })
    .then((res) => {
      toast.success('OK Created.');
      this.props.navigate(`/admin/problem/${res.data.shortname}`);
    })
    .catch((err) => {
      console.log(err)
      this.setState({errors: err.response.data})
    })
  }
  close() {
    this.setState({ errors: null })
    this.props.toggle(false);
  }

  render() {
    const {show, toggle} = this.props;
    return (
      <Modal show={show} onHide={() => this.close()}>
        <Modal.Header>
          <Modal.Title>+ Create Problem</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ErrorBox errors={this.state.errors} />
          <div>Problem Code</div>
          <Form.Control type="text" id="problem-shortname" placeholder="Problem Code"
            value={this.state.shortname} onChange={(e)=>this.setState({shortname: e.target.value})} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={() => this.close()}>
            Đóng
          </Button>
          <Button variant="dark" onClick={(e) => this.onSubmit(e)}>
            Tạo
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}
const NaviNewProb = withNavigation(NewProblemModal);

export default AdminProblemList;
