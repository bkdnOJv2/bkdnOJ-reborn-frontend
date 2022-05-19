import React from 'react';
import { connect } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import { Form, Row, Col, Tabs, Tab } from 'react-bootstrap';

import { FaPaperPlane, FaSignInAlt, FaExternalLinkAlt } from 'react-icons/fa';

import problemAPI from 'api/problem';
import { SpinLoader } from 'components';
import { withParams } from 'helpers/react-router'
import { setTitle } from 'helpers/setTitle';

import './AdminProblemDetails.scss';

class GeneralDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      data: this.props.data,
      options: this.props.options.actions.PUT || this.props.options.actions.PATCH
    }
  }

  inputChangeHandler(event) {
    let newData = this.state.data;
    newData[event.target.id] = event.target.value
    this.setState({ data : newData })
  }

  render() {
    const {data} = this.state;
    console.log(data);
    return (
      <Form id="problem-general">
        <sub>Thiết lập chung</sub>
        <Row>
          <Form.Label column="sm" lg={2}> URL </Form.Label>
          <Col> <Form.Control size="sm" type="text" placeholder="Problem URL" id="url"
                  value={data.url} disabled
          /></Col>
        </Row>
        <Row>
          <Form.Label column="sm" lg={2}> Shortname </Form.Label>
          <Col> <Form.Control size="sm" type="text" placeholder="Problem Shortname" id="shortname"
                  value={data.shortname} onChange={(e) => this.inputChangeHandler(e)}
          /></Col>
        </Row>
        <Row>
          <Form.Label column="sm" lg={2}> Title </Form.Label>
          <Col> <Form.Control size="sm" type="text" placeholder="Problem Title" id="title"
                  value={data.title} onChange={(e) => this.inputChangeHandler(e)}
          /></Col>
        </Row>
        <Row>
          <Form.Label column="sm" lg={2}> Time Limit </Form.Label>
          <Col> <Form.Control size="sm" type="text" placeholder="1.0" id="time_limit"
                  value={data.time_limit} onChange={(e) => this.inputChangeHandler(e)}
          /></Col>
        </Row>
        <Row>
          <Form.Label column="sm" lg={2}> Memory Limit</Form.Label>
          <Col> 
          <Form.Control size="sm" type="text" placeholder="256000" id="memory_limit"
                  value={data.memory_limit} onChange={(e) => this.inputChangeHandler(e)}
          /></Col>
        </Row>
        <sub>Những thiết lập dưới đây chỉ có tác dụng khi nộp ở bên ngoài contest (nộp ở trang Problem)</sub>
        <Row>
          <Form.Label column="sm" lg={2}> Điểm </Form.Label>
          <Col > 
            <Form.Control size="sm" type="number" id="points"
              value={data.points} onChange={(e) => this.inputChangeHandler(e)}
            />
          </Col>
        </Row>
        <Row>
          <Form.Label column="sm" lg={2}> Dừng chấm nếu có test sai </Form.Label>
          <Col > 
            <Form.Control size="sm" type="checkbox" id="short_circuit"
              value={data.short_circuit} onChange={(e) => this.inputChangeHandler(e)}
            />
            <sub>Dừng chấm bài nếu có một test cho kết quả không được chấp nhận.</sub>
          </Col>
        </Row>
        <Row>
          <Form.Label column="sm" lg={2}> Cho phép ăn điểm từng test </Form.Label>
          <Col > 
            <Form.Control size="sm" type="checkbox" id="partial"
              value={data.partial} onChange={(e) => this.inputChangeHandler(e)}
            />
            <sub>Cho phép ăn điểm theo từng test đúng. Nếu không tick thì người dùng chỉ có thể được 0đ hoặc full điểm.</sub>
          </Col>
        </Row>

        <sub>Các thiết lập khác sẽ được thêm sau.</sub>
      </Form>      
    )
  }
}

class AdminProblemDetails extends React.Component {
  constructor(props) {
    super(props);
    const { shortname } = this.props.params;
    this.shortname = shortname;
    this.state = { 
      loaded: false, errors: null, 
      options: undefined,
      general: undefined,
      testData: undefined,
    };
  }

  async componentDidMount() {
    Promise.all([
      problemAPI.adminProblemDetailsOptions({shortname: this.shortname}),
      problemAPI.getProblemDetails({shortname: this.shortname})
    ]).then((res) => {
      const [optionsRes, generalRes] = res;
      console.log(optionsRes.data)
      console.log(generalRes.data)
      this.setState({
        options: optionsRes.data,
        general: generalRes.data,
        loaded: true,
      })
      setTitle(`Admin | Problem ${generalRes.data.title}`)
    }).catch((err) => {
      this.setState({
        loaded: true,
        errors: err,
      })
    })
  }

  render() {
    if (this.state.redirectUrl) {
      return (
        <Navigate to={`${this.state.redirectUrl}`} />
      )
    }
    const {loaded, general, options} = this.state;
    
    return (
      <div className="admin problem-panel">
        <h4 className="problem-title"> 
          { !loaded ? <span><SpinLoader/> Loading...</span> : `Editing problem ${general.title}` }
        </h4>
        <hr/>
        <div className="problem-details">
          { 
          !loaded ? <span><SpinLoader/> Loading...</span> 
          : <>
          <Tabs defaultActiveKey="general" id="uncontrolled-tab-example" className="pl-2">
            <Tab eventKey="general" title="General">
              <GeneralDetails data={general} options={options}/>
            </Tab>
            <Tab eventKey="data" title="Test Data">
              <p>123</p>
            </Tab>
          </Tabs>
          </>
          }
        </div>
      </div>
    )
  }
}

let wrappedPD = AdminProblemDetails;
wrappedPD = withParams(wrappedPD);
const mapStateToProps = state => {
    return { user : state.user.user }
}
wrappedPD = connect(mapStateToProps, null)(wrappedPD);
export default wrappedPD;