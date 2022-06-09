import React from 'react';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { FaRegTrashAlt } from 'react-icons/fa';

import contestAPI from 'api/contest';
import { SpinLoader } from 'components';
import { withParams } from 'helpers/react-router'
import { setTitle } from 'helpers/setTitle';

import './Details.scss';

class AdminContestDetails extends React.Component {
  constructor(props) {
    super(props);
    const { key } = this.props.params;
    this.key = key;
    this.state = {
      loaded: false, errors: null,
      data: undefined,
    };
  }

  componentDidMount() {
    setTitle(`Admin | Contest ${this.key}`)
    contestAPI.getContest({key: this.key})
      .then((res) => {
        this.setState({
          data: res.data,
          loaded: true,
        })
      }).catch((err) => {
        this.setState({
          loaded: true,
          errors: err,
        })
      })
  }

  inputChangeHandler(event, params={isCheckbox: null}) {
    const isCheckbox = params.isCheckbox || false;

    let newData = this.state.data;
    if (!isCheckbox) newData[event.target.id] = event.target.value
    else {
      newData[event.target.id] = !newData[event.target.id]
    }
    this.setState({ data : newData })
  }

  deleteObjectHandler() {
    let conf = window.confirm("Deleting this Contest will delete: Contest Submissions, Contest Participation, Contest Problem. "+
      "Do you still want to delete?");
    if (conf) {
      contestAPI.deleteContest({id: this.id})
        .then((res) => {
          toast.success("OK Deleted.");
          this.setState({ redirectUrl : '/admin/contest/' })
        })
        .catch((err) => {
          toast.error(`Cannot delete. (${err})`);
        })
    }
  }

  render() {
    if (this.state.redirectUrl) 
      return ( <Navigate to={`${this.state.redirectUrl}`} /> )
    
    const {loaded, errors, data} = this.state;

    return (
      <div className="admin contest-panel wrapper-vanilla">
        <h4 className="contest-title">
          { !loaded && <span><SpinLoader/> Loading...</span>}
          { loaded && !!errors && <span>Something went wrong.</span>}
          { loaded && !errors && <div className="panel-header">
              <span className="title-text">{`Viewing Contest | ${data.name}`}</span>
              <span>
                <Button className="btn-svg" size="sm" variant="danger"
                  onClick={()=>this.deleteObjectHandler()}>
                    <FaRegTrashAlt/><span className="d-none d-md-inline">Delete</span>
                </Button>
              </span>
            </div>
          }
        </h4>
        <hr/>
        <div className="contest-details">
          { !loaded && <span><SpinLoader/> Loading...</span> }

          { loaded && !errors && <>
            <Form id="contest-general" onSubmit={(e) => this.formSubmitHandler(e)}>
              <Row>
                <Form.Label column="sm" xs={2} > ID </Form.Label>
                <Col> <Form.Control size="sm" type="text" placeholder="Contest id" id="id"
                        value={data.id || ''} disabled readOnly
                /></Col>
              </Row>
              <Row>
                <Form.Label column="sm" lg={2}> Key </Form.Label>
                <Col> <Form.Control size="sm" type="text" placeholder="Contest key/shortname/code" id="key"
                        value={data.key || ''} onChange={(e)=>this.inputChangeHandler(e)}
                /></Col>

                <Form.Label column="sm" lg={2}> Name </Form.Label>
                <Col> <Form.Control size="sm" type="text" placeholder="Contest Name" id="name"
                        value={data.name || ''} onChange={(e)=>this.inputChangeHandler(e)}
                /></Col>
              </Row>

              <Row>
                <Form.Label column="sm" > Is Rated? </Form.Label>
                <Col > <Form.Control size="sm" type="checkbox" id="is_rated"
                        checked={data.is_rated || false}
                        onChange={(e)=>this.inputChangeHandler(e, {isCheckbox: true})}
                /></Col>
              </Row>

              <Row>
                <Form.Label column="sm" > Is Visible? </Form.Label>
                <Col > <Form.Control size="sm" type="checkbox" id="is_visible"
                        checked={data.is_visible || false}
                        onChange={(e)=>this.inputChangeHandler(e, {isCheckbox: true})}
                /></Col>
                <Form.Label column="sm" > Is Visible For Organizations Only? </Form.Label>
                <Col > <Form.Control size="sm" type="checkbox" id="is_organization_private"
                        checked={data.is_organization_private || false}
                        onChange={(e)=>this.inputChangeHandler(e, {isCheckbox: true})}
                /></Col>
              </Row>

              <Row>
                <Form.Label column="sm" md={2}> Start Time </Form.Label>
                <Col> <Form.Control size="sm" type="datetime-local" id="start_time"
                        value={data.start_time} onChange={(e)=>console.log(e.target.value)}
                /></Col>
                <Form.Label column="sm" md={2}> End Time </Form.Label>
                <Col> <Form.Control size="sm" type="datetime-local" id="start_time"
                        value={data.end_time} onChange={(e)=>console.log(e.target.value)}
                /></Col>
              </Row>


              <hr className="m-2" />

              <Row>
                <Col lg={10}>
                  <sub>**Các thiết lập khác sẽ được thêm sau.</sub>
                </Col>
                <Col >
                  <Button variant="dark" size="sm" type="submit" >
                    Save
                  </Button>
                </Col>
              </Row>
            </Form>
          </>
          }
        </div>
      </div>
    )
  }
}

let wrappedPD = AdminContestDetails;
wrappedPD = withParams(wrappedPD);
export default wrappedPD;
// const mapStateToProps = state => {
//     return { user : state.user.user }
// }
// wrappedPD = connect(mapStateToProps, null)(wrappedPD);
