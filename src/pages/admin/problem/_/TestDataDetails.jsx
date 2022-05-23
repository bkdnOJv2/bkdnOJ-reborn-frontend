import React from 'react';
import { toast } from 'react-toastify';
import { Link, Navigate } from 'react-router-dom';
import { Accordion, Button, Form, Row, Col } from 'react-bootstrap';
import { FileUploader } from 'components'

import problemAPI from 'api/problem';

export default class TestDataDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shortname: this.props.shortname,
      data: {
        zipfile: null,
        zipfile_remove: false,
        generator_remove: false,
      },
      selectedZip: null,
    }
  }

  componentDidMount() {
    const {shortname} = this.state;
    problemAPI.adminGetProblemDetailsData({shortname})
    .then((res) => {
      this.setState({
        data: {  ...res.data, zipfile_remove: false, generator_remove: false }
      })
    }).catch((err) => {
      console.log(err)
    })
  }

  setSelectedZip(file) { this.setState({selectedZip: file}) }

  inputChangeHandler(event, params={isCheckbox: null}) {
    console.log(event);
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
    let {zipfile, ...sendData} = this.state.data;
    let formData = new FormData();

    if (this.state.selectedZip)
      formData.append("zipfile", this.state.selectedZip)
    for (let key in sendData)
      formData.append(key, sendData[key])

    problemAPI.adminEditProblemDataForm({
      shortname: this.state.shortname, formData
    }).then((res) => {
      toast.success("Saved.")
      // console.log(res)
      this.setState({
        data: {
          ...res.data,
          zipfile_remove: false,
          generator_remove: false,
        }
      });
    }).catch((err) => {
      console.log(err);
    })
  }

  render() {
    const {data} = this.state;
    return (
      <Form id="problem-general" onSubmit={(e) => this.formSubmitHandler(e)}>
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0" className="general">
          <Accordion.Header>Thiết lập chung</Accordion.Header>
          <Accordion.Body>
            <Row>
              <Form.Label column="sm" lg={2}> Archive </Form.Label>
              <Col lg={6}>
              {
                data.zipfile ? <a href={data.zipfile} className="text-truncate">{data.zipfile}</a>
                : "Not Available"
              }
              <FileUploader
                onFileSelectSuccess={(file) => this.setSelectedZip(file)}
                onFileSelectError={({ error }) => alert(error)}
              />
              </Col>
            </Row>
            <Row>
              <Form.Label column="sm" > Remove Archive? </Form.Label>
              <Col >
                <Form.Control size="sm" type="checkbox" id="zipfile_remove"
                  checked={data.zipfile_remove} onChange={(e) => this.inputChangeHandler(e, {isCheckbox: true})}
                />
              </Col>
            </Row>
            <Row>
              <Form.Label column="sm" lg={4}> Checker </Form.Label>
              <Col>
                  <Form.Select aria-label={data.checker} size="sm" value={data.checker}
                    id="checker" onChange={(e) => this.inputChangeHandler(e)}
                  >
                    <option value="standard">Standard</option>
                    <option value="floats">Floats</option>
                    <option value="floatsabs">Floats (Absolute)</option>
                    <option value="floatsrel">Floats (Relative)</option>
                    <option value="rstripped">Non-trailing spaces</option>
                    <option value="sorted">Unordered</option>
                    <option value="identical">Byte identical</option>
                    <option value="linecount">Line-by-line</option>
                  </Form.Select>
              </Col>
            </Row>
            <Row>
              <Form.Label column="sm" lg={6}> Checker Args </Form.Label>
              <Col> <Form.Control size="sm" type="textarea" placeholder="Checker Args" id="checker_args"
                      value={data.checker_args || ''} onChange={(e) => this.inputChangeHandler(e)}
              /></Col>
            </Row>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="1" className="testcase">
          <Accordion.Header>Testcases</Accordion.Header>
          <Accordion.Body>

          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <Row>
        <Col lg={10}>
          <sub>**Các thiết lập khác sẽ được thêm sau.</sub>
        </Col>
        <Col >
          <Button variant="dark" size="sm" type="submit">
            Save
          </Button>
        </Col>
      </Row>
      </Form>
    )
  }
}
