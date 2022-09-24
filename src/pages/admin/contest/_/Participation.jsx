import React from "react";
import {Form, Row, Col, Table, Button, Modal} from "react-bootstrap";
import ReactPaginate from "react-paginate";

import {
  FaPlusCircle, FaFilter, FaTimes, FaRegSave
} from "react-icons/fa";

import {getLocalDateWithTimezone} from "helpers/dateFormatter";
import {qmClarify} from "helpers/components";

import {SpinLoader, ErrorBox} from "components";
import OrgSingleSelect from "components/SelectSingle/Org";
import OrgMultiSelect from "components/SelectMulti/Org";
import contestAPI from "api/contest";
import "./Participation.scss";
import "styles/ClassicPagination.scss";

class Filters extends React.Component {
  constructor (props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <div className="participation-filters">
        <strong>Filters:</strong>
        <div className="options border p-1">
          <Row className="m-0 mb-2 mt-2">
            <Col className="" xl={12}>
              <span className="flex-center">
                <input type="checkbox" id="part-filter-type-chk" className="mr-1"
                  value={this.state.filterByTypeChk}
                  onChange={e => this.setState({filterByTypeChk : e.target.checked })}
                /> 
                <label htmlFor="part-filter-type-chk">Filter by Type</label>
                {qmClarify("Chỉ có tác dụng nếu được check. "+
                            "Disable muốn truy vấn tất cả type. ")}
              </span>
            </Col>
            <Col className="ml-2">
              {VIRTUAL_TYPE.map(type => (
                <div key={`part-${type}`} className="d-inline">
                  <Form.Check
                    inline
                    name="participation-type"
                    type="radio"
                    disabled={!this.state.filterByTypeChk}
                    id={`${type}`}
                    label={`${type}`}
                    checked={type === this.state.virtual}
                    onChange={e => this.setState({virtual: e.target.id})}
                  />
                </div>
              ))}
            </Col>
          </Row>

          <Row className="flex-center m-0 mb-2">
            <Col className="d-inline-flex" lg={12}>
              <span className="flex-center">
                <input type="checkbox" id="part-filter-org-chk" className="mr-1"
                  value={this.state.filterByOrgChk}
                  onChange={e => this.setState({filterByOrgChk : e.target.checked })}
                /> 
                <label htmlFor="part-filter-org-chk">Filter by Orgs</label>
                {qmClarify("Chỉ có tác dụng nếu được check. "+
                            "Để trống nếu muốn truy vấn các phiên đăng ký mà không có org. "+
                            "Ngược lại sẽ truy vấn tất cả phiên mà có org trong list")}
              </span>
            </Col>
            <Col className="ml-2 d-inline-flex">
              <OrgMultiSelect isDisabled={!this.state.filterByOrgChk}/>
            </Col>
          </Row>

          <Row className="flex-center m-0 mb-2">
            <Col className="d-inline-flex" lg={12}>
              <span className="flex-center">
                <input type="checkbox" id="part-filter-search-chk" className="mr-1"
                  value={this.state.filterBySearchChk}
                  onChange={e => this.setState({filterBySearchChk : e.target.checked })}
                /> 
                <label htmlFor="part-filter-search-chk">Search</label>
                {qmClarify("Chỉ có tác dụng nếu được check. "+
                            "Tìm theo username:\n  'abc*' để tìm 'abcde', 'abc123',.;\n  '*x*' để tìm username có 1 ký tự 'x'")}
              </span>
            </Col>
            <Col className="ml-2 d-inline-flex">
              <input type="text" className="w-100" disabled={!this.state.filterBySearchChk }
                      placeholder="Search username, can use wildcard character *"
              ></input>
            </Col>
          </Row>

          <div className="d-inline-flex flex-row-reverse w-100">
            <Button
              size="sm"
              variant="dark"
              className="ml-1 mr-1 btn-svg"
              onClick={() => this.refetch()}
            >
              <FaFilter/> Filter
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="ml-1 mr-1 btn-svg"
              onClick={() => this.resetFetch()}
            >
              <FaTimes/> Reset
            </Button>
          </div>
        </div>
      </div>
    )
  }
}


const INITIAL_STATE = {
  participations: [],
  count: null,
  currPage: 0,
  pageCount: 1,
  // bools
  loaded: false,
  errors: null,
  // params
  virtual: null,
  // modal
  selectChk: [],
};
const VIRTUAL_TYPE = ["LIVE", "SPECTATE"];

class Participation extends React.Component {
  constructor(props) {
    super(props);
    this.ckey = this.props.ckey;
    this.state = {
      ...INITIAL_STATE,
      filters: {},
      addParticipationModalShow: false,
      setOrganizationModalShow: false,
    };
  }
  openAddParticipationModal() {
    this.setState({addParticipationModalShow: true});
  }
  closeAddParticipationModal() {
    this.setState({addParticipationModalShow: false});
  }
  openSetOrganizationModal() {
    this.setState({setOrganizationModalShow: true});
  }
  closeSetOrganizationModal() {
    this.setState({setOrganizationModalShow: false});
  }

  resetFetch() {
    this.setState(INITIAL_STATE, () => this.refetch());
  }

  refetch(params = {page: 0}) {
    this.setState({loaded: false, errors: null});
    let prms = {page: params.page + 1};

    if (this.state.virtual) prms.virtual = this.state.virtual;

    contestAPI
      .getContestParticipations({key: this.ckey, params: prms})
      .then(res => {
        this.setState({
          participations: res.data.results,
          count: res.data.count,
          pageCount: res.data.total_pages,
          currPage: params.page,

          selectChk: Array(res.data.results.length).fill(false),
          loaded: true,
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({
          loaded: true,
          errors: ["Cannot fetch Participations for this contest."],
        });
      });
  }

  handlePageClick = event => {
    this.refetch({page: event.selected});
  };

  componentDidMount() {
    this.refetch();
  }

  genMessageActOnParticipations(action, params, affected) {
    let stringified = JSON.stringify(affected);
    if (stringified.length > 255) {
      stringified = stringified.substring(0, 255-4)+"...]"
    }
    if (action === 'delete') {
      return "Bạn đang xóa các lượt tham dự:\n"+
        `${stringified}`+"\nBạn có muốn tiếp tục?"
    } else
    if (action === 'disqualify') {
      return "Bạn đang hủy tư cách thi đấu (disqualify) của các lượt tham dự:\n"+
        `${stringified}`+"\nBạn có muốn tiếp tục?"
    } else 
    if (action === 'undisqualify') {
      return "Bạn muốn khôi phục tư cách thi đấu (undisqualify) của các lượt tham dự:\n"+
        `${stringified}`+"\nBạn có muốn tiếp tục?"
    } else 
    if (action === 'set-org') {
      return `Bạn muốn đặt org='${params.organization}' cho các lượt tham dự sau:`+
        `${stringified}`+"\nBạn có muốn tiếp tục?"
    }
    return `Unrecognized action '${action}'`
  }

  actOnParticipations(action, params) {
    let partIds = [], partUsers = []
    this.state.participations.map( (p, i) => {
      if (this.state.selectChk[i]) {
        partIds.push(p.id);
        partUsers.push(p.user)
      }
    })
    
    if (partIds.length === 0) {
      alert("Không có lượt đăng ký nào đang được chọn.")
      return;
    }
    const conf = window.confirm(this.genMessageActOnParticipations(
      action, params, partUsers,
    ))
    if (!conf) return;

    const data = {
      action: action.toLowerCase(),
      data: {
        participations: partIds,
        ...params,
      }
    }
    console.log(data);

    contestAPI.actContestParticipation({
      key: this.ckey,
      data,
    }).then((res) => {
      console.log(res)
    }).catch((err) => {
      console.log('ActOnParticipations')
      console.log(err)
    })
  }

  render() {
    const {participations} = this.state;
    return (
      <div className="contest-participation-wrapper">
        <div className="table-wrapper m-2">
          <Filters value={this.state.filters} onChange={data => this.setState({ filters: data })} />

          <hr className="m-2" />
          <div className="contest-participation-options-wrapper border p-1 mb-1">
            <strong>Actions</strong>
            {qmClarify("Actions sẽ tác động những lượt tham dự được select. Select chúng bằng checkbox bên phải ở table bên dưới.")}
            <div className="contest-participation-options">
              <Button size="sm" variant="dark"
                onClick={() => {
                  alert(
                    JSON.stringify(this.state.selectChk)
                  )
                }}
              >Show</Button>
              <span className="ml-1 mr-1">
                <Button size="sm" variant="warning"
                  onClick={()=>this.openSetOrganizationModal()}
                >Change Org</Button>
              </span>
              <span className="ml-1 mr-1">
                <Button size="sm" variant="warning"
                  onClick={()=>this.actOnParticipations('disqualify')}
                >Disqualify</Button>
                <Button size="sm" variant="success"
                  onClick={()=>this.actOnParticipations('undisqualify')}
                >Undisqualify</Button>
              </span>
              <span className="ml-1 mr-1">
                <Button size="sm" variant="danger"
                  onClick={()=>this.actOnParticipations('delete')}
                >Delete</Button>
              </span>
            </div>
          </div>

          <div className="admin-table contest-participation-table">
            <h4 className="contest-participation-lbl m-0">Participations</h4>
            <div className="part-add-btn">
              <Button
                size="sm"
                variant="dark"
                style={{width: "100%"}}
                className="btn-svg"
                onClick={() => this.openAddParticipationModal()}
              >
                <FaPlusCircle /> Add
              </Button>
            </div>
            <Table
              responsive
              hover
              size="sm"
              striped
              bordered
              className="rounded mb-0"
            >
              <thead>
                <tr>
                  <th>#</th>
                  <th>User</th>
                  <th>When</th>
                  <th>
                    Type
                    {qmClarify(
                      "Hình thức tham dự của thí sinh. \n* -1 -> SPECTATE, chỉ theo dõi, kết quả không được tính\n" +
                        "* 0 -> LIVE, thí sinh tham dự chính thức\n* khác -> VIRTUAL, thí sinh tham dự không chính " +
                        "thức, sau khi contest đã kết thúc."
                    )}
                  </th>
                  <th>
                    Org
                  </th>
                  <th>
                    Disqualified
                    {qmClarify(
                      "Những lần tham dự bị Disqualified này sẽ mang điểm là -9999 trên bảng xếp hạng. " +
                        "Nếu lượt tham dự này là LIVE, thí sinh này sẽ không được xếp hạng Rating."
                    )}
                  </th>
                  <th>
                    <input type="checkbox"
                      onChange={e => {
                        const arrLeng = this.state.selectChk.length
                        this.setState({
                          selectChk: Array(arrLeng).fill(e.target.checked)
                        })
                      }}
                    ></input>
                  </th>
                </tr>
              </thead>
              <tbody>
                {participations.length === 0 &&
                  <tr><td colSpan={99}><span><em>
                    No participations
                  </em></span></td></tr>
                }
                {participations.map((part, ridx) => (
                  <tr key={`ct-part-${part.id}`}>
                    <td>{part.id}</td>
                    <td>{part.user}</td>
                    <td>{getLocalDateWithTimezone(part.real_start)}</td>
                    <td>{part.virtual}</td>
                    <td>{part.organization || "None"}</td>
                    <td>{part.is_disqualified ? "Yes" : "No"}</td>
                    <td>
                      <input type="checkbox" 
                        checked={this.state.selectChk[ridx]}
                        onChange={() => {
                          const selectChk = this.state.selectChk;
                          this.setState({
                            selectChk: selectChk.map((v, i) => i === ridx ? !v : v)
                          })
                        }}
                      />
                    </td>
                  </tr>
                ))}{" "}
              </tbody>
            </Table>
            {this.state.loaded === false ? (
              <SpinLoader margin="0" />
            ) : (
              <span className="classic-pagination">
                Page:{" "}
                <ReactPaginate
                  breakLabel="..."
                  onPageChange={this.handlePageClick}
                  forcePage={this.state.currPage}
                  pageLabelBuilder={page => `[${page}]`}
                  pageRangeDisplayed={3}
                  pageCount={this.state.pageCount}
                  renderOnZeroPageCount={null}
                  previousLabel={null}
                  nextLabel={null}
                />
              </span>
            )}
          </div>
        </div>
        <SetOrganizationModal
          ckey={this.ckey}
          modalShow={this.state.setOrganizationModalShow}
          closeModalHandler={() => this.closeSetOrganizationModal()}
          actOnParticipations={(act, data)=>this.actOnParticipations(act, data)}
          refetch={() => this.refetch()}
        />
        <AddParticipationModal
          ckey={this.ckey}
          modalShow={this.state.addParticipationModalShow}
          closeModalHandler={() => this.closeAddParticipationModal()}
          refetch={() => this.refetch()}
        />
      </div>
    );
  }
}

class SetOrganizationModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOrg: null,
    }
  }

  closeModalHandler() {
    this.setState({submitting: false, errors: null});
    this.props.closeModalHandler();
  }

  render() {
    return (
      <Modal
        show={this.props.modalShow}
        onHide={() => this.closeModalHandler()}
      >
        <Modal.Header>
          <Modal.Title>Set Organization</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Lựa chọn tổ chức đến gán cho các lượt đăng ký:
          <OrgSingleSelect
            onChange={sel => this.setState({selectedOrg: sel})}
            value={this.state.selectedOrg}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button 
            size="sm"
            variant="secondary" 
            className="btn-svg"
            onClick={() => this.closeModalHandler()}
          >
            <FaTimes/> Đóng
          </Button>
          <Button
            size="sm"
            variant="danger"
            className="btn-svg"
            onClick={() => this.props.actOnParticipations(
              'set-org', 
              {organization: this.state.selectedOrg.slug}
            )}
          >
            <FaRegSave/> Lưu 
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

class AddParticipationModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addPartType: null,
      users: "",
      submitting: false,
      errors: null,
    };
  }

  submitHandler(e) {
    e.preventDefault();

    let {addPartType, users} = this.state;
    if (!addPartType) {
      alert("Hãy chọn 1 tư cách tham dự.");
      return false;
    }
    users.trim();
    if (users.length === 0) {
      alert("Hãy thêm ít nhất 1 người dùng.");
      return false;
    }
    users = users.split(/\s+/).filter(u => u !== "");

    this.setState({submitting: true, errors: null});

    const data = {users, participation_type: addPartType};
    contestAPI
      .addContestParticipations({key: this.props.ckey, data})
      .then(() => {
        this.props.closeModalHandler();
        this.props.refetch();
        this.setState({submitting: false});
      })
      .catch(err => {
        this.setState({
          errors: err.response.data,
          submitting: false,
        });
      });
  }

  closeModalHandler() {
    this.setState({submitting: false, errors: null});
    this.props.closeModalHandler();
  }

  render() {
    const {addPartType, users, submitting, errors} = this.state;

    return (
      <Modal
        show={this.props.modalShow}
        onHide={() => this.closeModalHandler()}
      >
        <Modal.Header>
          <Modal.Title>Thêm Participation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ErrorBox errors={errors} />
          <Form
            id="contest-participation-add-form"
            onSubmit={e => this.submitHanlder(e)}
          >
            <div className="">Thêm họ với tư cách tham dự:</div>
            <div className="flex-center">
              {VIRTUAL_TYPE.map(type => (
                <div key={`part-${type}`} className="flex-center">
                  <Form.Check
                    inline
                    name="add-participation-type"
                    type="radio"
                    id={`add-participation-type-${type}`}
                    label={`${type}`}
                    checked={type === addPartType}
                    onChange={() => this.setState({addPartType: type})}
                  />
                </div>
              ))}
            </div>

            <Form.Control
              as="textarea"
              style={{height: "100px"}}
              placeholder="username1 username2 username3"
              value={users}
              onChange={e => this.setState({users: e.target.value})}
            />
            <div className="flex-center">
              <em style={{fontSize: "12px"}}>
                Dán những tên người dùng (space-separated) mà bạn muốn đăng ký
                vào contest. Nếu có người dùng được thêm đã đăng ký (với tư cách
                là LIVE hoặc SPECTATE), hệ thống sẽ chỉnh lại Participation Type
                của họ.
              </em>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={() => this.closeModalHandler()}>
            Đóng
          </Button>
          <Button
            variant="danger"
            disabled={submitting}
            onClick={e => this.submitHandler(e)}
          >
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

let wrapped = Participation;
export default wrapped;
