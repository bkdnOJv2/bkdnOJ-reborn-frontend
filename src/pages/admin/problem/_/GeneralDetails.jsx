import React from 'react';
import { Navigate } from 'react-router-dom';
import { Form, Row, Col, Tabs, Tab, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

import problemAPI from 'api/problem';
import { FileUploader } from 'components';

export default class GeneralDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      shortname: this.props.shortname,
      data: this.props.data,
      options: this.props.options.actions.PUT || this.props.options.actions.PATCH,
      selectedPdf: null
    }
  }
  setSelectedPdf(file) {
    this.setState({selectedPdf: file})
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
  formSubmitHandler(e) {
    e.preventDefault();
    let {pdf, ...sendData} = this.state.data;
    let reqs = [];

    if (this.state.selectedPdf) {
      const formData = new FormData();
      formData.append("pdf", this.state.selectedPdf);
      reqs.push(
        problemAPI.adminEditProblemPDF({
          shortname: this.state.shortname, formData
        })
      )
    }
    reqs.push(
      problemAPI.adminEditProblemDetails({
        shortname: this.state.shortname, 
        data: sendData.data
      })
    )

    Promise.all(
      reqs
    ).then((res) => {
      toast.success("Saved.")
      // window.location = `/admin/problem/${res.data.shortname}`
      console.log(res);
    }).catch((err) => {
      console.log(err);
    })
  }

  render() {
    const {data} = this.state;
    // console.log(data);
    return (
      <Form id="problem-general" onSubmit={(e) => this.formSubmitHandler(e)}>
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
        <Row>
          <Form.Label column="sm" lg={2}> PDF </Form.Label>
          <Col> 
          {
            data.pdf ? <a href={data.pdf} className="text-truncate">{data.pdf}</a> : "Not Available"
          }
           <FileUploader
            onFileSelectSuccess={(file) => this.setSelectedPdf(file)}
            onFileSelectError={({ error }) => alert(error)}
          />
          </Col>
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
              checked={data.short_circuit} onChange={(e) => this.inputChangeHandler(e, {isCheckbox: true})}
            />
            {/* <sub>Dừng chấm bài nếu có một test cho kết quả không được chấp nhận.</sub> */}
          </Col>
        </Row>
        <Row>
          <Form.Label column="sm" lg={2}> Cho phép ăn điểm từng test </Form.Label>
          <Col > 
            <Form.Control size="sm" type="checkbox" id="partial"
              checked={data.partial} onChange={(e) => this.inputChangeHandler(e, {isCheckbox: true})}
            />
            {/* <sub>Cho phép ăn điểm theo từng test đúng. Nếu không tick thì người dùng chỉ có thể được 0đ hoặc full điểm.</sub> */}
          </Col>
        </Row>
        <Row>
          <Col lg={8}>
            <sub>Các thiết lập khác sẽ được thêm sau.</sub>
          </Col>
          <Col >
            <Button variant="dark" size="sm" type="submit">
              Submit
            </Button>
          </Col>
        </Row>
      </Form>      
    )
  }
}