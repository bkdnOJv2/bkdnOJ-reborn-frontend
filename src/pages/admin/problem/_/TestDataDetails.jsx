import React from 'react';
import { toast } from 'react-toastify';
import { Link, Navigate } from 'react-router-dom';
import { Accordion, Button, Form, Row, Col } from 'react-bootstrap';
import { FileUploader } from 'components'
import {VscRefresh} from 'react-icons/vsc';

import problemAPI from 'api/problem';

export default class TestDataDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        zipfile: null,
        zipfile_remove: false,
        generator_remove: false,
      },
      selectedZip: null,
      submitting: false,
    }
  }
  refetch() {
    const {shortname} = this.props;
    problemAPI.adminGetProblemDetailsData({shortname})
    .then((res) => {
      console.log(res.data)
      this.setState({
        data: {  ...res.data, zipfile_remove: false, generator_remove: false }
      })
    }).catch((err) => {
      console.log(err)
    })
  }

  componentDidMount() {
    this.refetch();
  }

  setSelectedZip(file) { this.setState({selectedZip: file}) }

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
    let {zipfile, ...sendData} = this.state.data;
    let formData = new FormData();

    if (this.state.selectedZip)
      formData.append("zipfile", this.state.selectedZip)
    for (let key in sendData)
      formData.append(key, sendData[key])

    this.setState({ submitting: true }, () => {
      problemAPI.adminEditProblemDataForm({
        shortname: this.props.shortname, formData
      }).then((res) => {
        toast.success("Saved.")
        // console.log(res)
        this.setState({
          data: {
            ...res.data,
            zipfile_remove: false,
            generator_remove: false,
          },
          submitting: false,
        })
      }).catch((err) => {
        console.log(err);
        this.setState({
          errors: err.response.data,
          submitting: false,
        })
      })
    })
  }

  render() {
    const {data} = this.state;
    return (
      <Form id="problem-general" onSubmit={(e) => this.formSubmitHandler(e)}>
        <Row className="options m-1 border">
          <Col> </Col>
          <Button variant="dark" size="sm" className="btn-svg"
            onClick={()=>this.refetch()}>
            <VscRefresh/> Refresh
          </Button>
        </Row>
        <Row>
          <Form.Label column="sm" md={2}> Archive </Form.Label>
          <Col md={10}>
            <div className="p-0">
              {
                data.zipfile ? <a href={data.zipfile} className="text-truncate">{data.zipfile}</a>
                : "Not Available"
              }
              <FileUploader
                onFileSelectSuccess={(file) => this.setSelectedZip(file)}
                onFileSelectError={({ error }) => alert(error)}
              />
            </div>
          </Col>

          <Form.Label column="sm" xs={3}> Remove Archive? </Form.Label>
          <Col xs={9}>
            <Form.Control size="sm" type="checkbox" id="zipfile_remove"
              checked={data.zipfile_remove} onChange={(e) => this.inputChangeHandler(e, {isCheckbox: true})}
            />
          </Col>
        </Row>
        <Row>
          <Form.Label column="sm" lg={3}> Checker </Form.Label>
          <Col lg={9}>
              <Form.Select aria-label={data.checker} size="sm" value={data.checker}
                id="checker" onChange={(e) => this.inputChangeHandler(e)}
                className="mb-1"
              >
                <option value="standard">Standard</option>
                <option value="floats">Floats</option>
                <option value="floatsabs">Floats (Absolute)</option>
                <option value="floatsrel">Floats (Relative)</option>
                <option value="rstripped">Non-trailing spaces</option>
                <option value="sorted">Unordered</option>
                <option value="identical">Byte identical</option>
                <option value="linecount">Line-by-line</option>
                <option value="custom-py3">Custom checker (Py3)</option>
              </Form.Select>
          </Col>

          <Form.Label column="sm" lg={3}> Checker Extra Arguments (JSON) </Form.Label>
          <Col lg={12}>
            <Form.Control size="sm" as="textarea" placeholder={`{"precision": 6}`} id="checker_args"
                  value={data.checker_args || ''} onChange={(e) => this.inputChangeHandler(e)}
                  className="mb-1"
            />
          </Col>
          <Col xl={12}><sub>
            Tham số thêm cho checker. <code>(args)</code>
          </sub></Col>
        </Row>

        <Row>
          <Col xl={12} className="m-0 p-0"><strong>Checker Help</strong></Col>
          <Col xl={12} className="m-0 p-0">
            <Accordion defaultActiveKey="-1">
            <Accordion.Item eventKey="0" className="checker-standard-help">
              <Accordion.Header>Checker: Standard</Accordion.Header>
              <Accordion.Body className="p-1">
                <p>Là checker mặc định khi tạo ra Problem.</p>
                <p>Checker này sẽ so sánh output submission và output của judge theo từng token, hay word.
                  Cụ thể, một token hay word là một xâu con nằm giữa hai ký tự trắng (space, tab, newline,...).
                  Output sẽ được cắt thành một mảng các token. Bài nộp đúng khi hai output tạo ra hai mảng token giống nhau.
                </p>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="1" className="checker-floats-help">
              <Accordion.Header>Checker: Floats</Accordion.Header>
              <Accordion.Body className="p-1">
                <p>Sử dụng checker <code>floats</code> nếu output bị ảnh hưởng bới sai số số thực.</p>
                <p>Tất cả output không phải số sẽ được xem như string và sẽ so sánh bằng. Đối với output số,
                  chúng sẽ được so sánh số thực dựa vào giá trị của <code>args</code>.
                </p>
                <p>
                  Cụ thể, <code>args</code> nhận các khóa sau:
                </p>
                <ul>
                  <li>
                    <code>precision</code>: Một số nguyên, mô tả epsilon. Mặc định: <code>6</code>.
                  </li>
                  <li>
                    <code>error_mode</code>: Một xâu ký tự, mô tả chế độ sai số.
                    Mặc định, output sẽ được check theo cả hai absolute và relative, đúng 1 hoặc 2 được xem như đúng.
                    Nếu mang giá trị <code>absolute</code>, check absolute error.
                    Nếu mang giá trị <code>relative</code>, check relative error.
                  </li>
                </ul>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="2" className="checker-floatsabs-help">
              <Accordion.Header>Checker: Floats (Absolute)</Accordion.Header>
              <Accordion.Body className="p-1">
                <p>Là shortcut cho checker <code>floats</code> với <code>error_mode</code> là <code>absolute</code></p>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="3" className="checker-floatsrel-help">
              <Accordion.Header>Checker: Floats (Relative)</Accordion.Header>
              <Accordion.Body className="p-1">
                <p>Là shortcut cho checker <code>floats</code> với <code>error_mode</code> là <code>relative</code></p>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="4" className="checker-non-trailing-spaces-help">
              <Accordion.Header>Checker: Non-trainling spaces</Accordion.Header>
              <Accordion.Body className="p-1">
                <p>Output sẽ được so theo từng dòng. Mỗi dòng sẽ được xóa tất cả ký tự trắng phía bên phải trước, sau đó được so sánh bằng.
                  Số lượng dòng phải bằng nhau.</p>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="5" className="checker-unordered-help">
              <Accordion.Header>Checker: Unordered</Accordion.Header>
              <Accordion.Body className="p-1">
                <p>Như checker <code>standard</code>, nhưng trước khi so sánh, mảng token sẽ được sort lại.</p>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="6" className="checker-identical-help">
              <Accordion.Header>Checker: Byte identical</Accordion.Header>
              <Accordion.Body className="p-1">
                <p>Hai output sẽ được so khớp từng byte một.</p>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="7" className="checker-line-by-line-help">
              <Accordion.Header>Checker: Line-by-line</Accordion.Header>
              <Accordion.Body className="p-1">
                <p><code>linecount</code> checker so khớp từng dòng hai output. <code>args</code> nhận một khóa
                  <code>feedback</code> mặc định là <code>true</code>,
                  nghĩa là yêu cầu máy chấm phản hồi feedback đúng/sai cho từng dòng.
                </p>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>
      </Row>

      <Row>
        <Col lg={10}>
          <sub></sub>
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
