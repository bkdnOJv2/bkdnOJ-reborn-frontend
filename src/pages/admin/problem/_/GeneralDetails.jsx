import React from 'react';
import { Navigate } from 'react-router-dom';
import { Accordion, Form, Row, Col, Tabs, Tab, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

import problemAPI from 'api/problem';
import { withNavigation } from 'helpers/react-router';
import { FileUploader } from 'components';

class GeneralDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
      // options: this.props.options.actions.PUT || this.props.options.actions.PATCH,
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
  getTime(key) {
    const data = this.state.data;
    if (data && data[key]) {
      let time = new Date(data[key])
      time.setMinutes(time.getMinutes() - time.getTimezoneOffset());
      return time.toISOString().slice(0, 16);
    }
    return '';
  }
  setTime(key, v) {
    let time = new Date(v)
    const data = this.state.data;
    console.log(key, time.toISOString())
    console.log('Before', data)
    this.setState({ data : { ...data, [key]: time.toISOString() } },
    () => console.log('After', data)
    );
  }

  formSubmitHandler(e) {
    e.preventDefault();
    this.setState({errors: null})

    let {pdf, ...sendData} = this.state.data;
    delete sendData.allowed_languages
    let reqs = [];

    reqs.push(
      problemAPI.adminEditProblemDetails({
        shortname: this.props.shortname,
        data: sendData,
      })
    )
    if (this.state.selectedPdf) {
      const formData = new FormData();
      formData.append("pdf", this.state.selectedPdf);
      reqs.push(
        problemAPI.adminEditProblemDetailsForm({
          shortname: this.props.shortname, formData
        })
      )
    }

    Promise.all(
      reqs
    ).then((results) => {
      toast.success("OK Updated.")
      this.setState({ data: results[0].data });
      this.props.setProblemTitle && this.props.setProblemTitle(results[0].data.title)
      if (results[0].data.shortname !== this.props.shortname) {
        this.props.refetch(results[0].data.shortname)
        this.props.navigate(`/admin/problem/${results[0].data.shortname }`)
      }
    }).catch(err => {
      const data = err.response.data;
      if (this.props.setErrors) {
        this.props.setErrors({errors: data})
      }
    })
  }

  render() {
    const {data} = this.state;
    // console.log(data);
    return (
      <Form id="problem-general" onSubmit={(e) => this.formSubmitHandler(e)}>
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0" className="general">
          <Accordion.Header>Thiết lập chung</Accordion.Header>
          <Accordion.Body>
            {/* <Row>
              <Form.Label column="sm" lg={2}> Resource URL </Form.Label>
              <Col> <Form.Control size="sm" type="text" placeholder="Problem URL" id="url"
                      value={data.url} disabled
              /></Col>
            </Row> */}
            <Row>
              <Form.Label column="sm" md={2} className="required"> Problem Code </Form.Label>
              <Col md={3}> <Form.Control size="sm" type="text" placeholder="Problem Code" id="shortname"
                      value={data.shortname} onChange={(e) => this.inputChangeHandler(e)} required
              /></Col>

              <Form.Label column="sm" md={1} className="required" > Title </Form.Label>
              <Col md={6}> <Form.Control size="sm" type="text" placeholder="Problem Title" id="title"
                      value={data.title} onChange={(e) => this.inputChangeHandler(e)} required
              /></Col>
            </Row>
            <Row>
              <Form.Label column="sm" sm={3}> Ngày tạo </Form.Label>
              <Col> <Form.Control size="sm" type="datetime-local" id="date"
                      onChange={(e)=>this.setTime(e.target.id, e.target.value)}
                      value={this.getTime('date') || ''}
              /></Col>
            </Row>

            <Row>
              <Form.Label column="sm" lg={12}> Statement (Not Implemented) </Form.Label>
              <Col> <Form.Control size="sm" lg={12} as="textarea" placeholder="Problem Statement" id="content"
                      value={data.content} onChange={(e) => this.inputChangeHandler(e)}
              /></Col>
            </Row>
            <Row>
              <Form.Label column="sm" xl={12}> PDF </Form.Label>
              <Col md={6}>{
                data.pdf ? <a href={data.pdf} className="text-truncate">{data.pdf}</a>
                  : "None"}
              </Col>
              <Col md={6}>
                <FileUploader
                  onFileSelectSuccess={(file) => this.setSelectedPdf(file)}
                  onFileSelectError={({ error }) => alert(error)}
                />
              </Col>
            </Row>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="1" className="problem-access-control">
          <Accordion.Header>Quyền truy cập</Accordion.Header>
          <Accordion.Body>
            <Row>
              <Form.Label column="sm" sm={3} className="required"> Authors </Form.Label>
              <Col> <Form.Control size="sm" type="text" placeholder="authors" id="authors"
                      value={JSON.stringify(data.authors)} disabled
              /></Col>
            </Row>
            <Row>
              <Form.Label column="sm" sm={3}> Collaborators </Form.Label>
              <Col> <Form.Control size="sm" type="text" placeholder="collaborators" id="collaborators"
                      value={JSON.stringify(data.collaborators)} disabled
              /></Col>
            </Row>
            <Row>
              <Form.Label column="sm" sm={3}> Reviewers </Form.Label>
              <Col> <Form.Control size="sm" type="text" placeholder="reviewers" id="reviewers"
                      value={JSON.stringify(data.reviewers)} disabled
              /></Col>
            </Row>

            <Row>
              <Form.Label column="sm" sm={3}> Công khai </Form.Label>
              <Col sm={9}>
                <Form.Control size="sm" type="checkbox" id="is_public"
                  checked={data.is_public} onChange={(e) => this.inputChangeHandler(e, {isCheckbox: true})}
                />
              </Col>
              <Col xl={12}><sub>
                Nếu không tick, chỉ có những cá nhân được add thông qua Authors, Collaborators, Reviewers, và những
                cá nhân có đặc quyền mới truy cập được Problem.
                Nếu có tick, tùy thuộc vào trường bên dưới (Public to Organizations) mà cho phép mọi người hoặc chỉ
                cho tổ chức thấy và nộp bài.
              </sub></Col>
            </Row>

            <Row>
              <Form.Label column="sm" sm={3}> Chỉ Công khai cho các Tổ chức  </Form.Label>
              <Col sm={9}>
                <Form.Control size="sm" type="checkbox" id="is_organization_private"
                  checked={data.is_organization_private} onChange={(e) => this.inputChangeHandler(e, {isCheckbox: true})}
                />
              </Col>

              <Form.Label column="sm" sm={3}> Tổ chức </Form.Label>
              <Col sm={9}> <Form.Control size="sm" type="text" placeholder="organizations" id="organizations"
                      value={JSON.stringify(data.organizations)} disabled
              /></Col>

              <Col xl={12}><sub>
                Nếu có tick và problem đang công khai, chỉ thành viên của tổ chức được thêm mới thấy và nộp bài được.
                Nếu không tick và đang công khai, mọi User đều thấy và nộp bài được.
              </sub></Col>
            </Row>
            <Row>
              <Form.Label column="sm" lg={4}> Chính sách xem chi tiết Submission  </Form.Label>
              <Col>
                  <Form.Select aria-label={data.submission_visibility_mode}
                    value={data.submission_visibility_mode || ''}
                    onChange={(e) => this.inputChangeHandler(e)}
                    size="sm" id="submission_visibility_mode" className="mb-1"
                  >
                    <option value="FOLLOW">Default (Chỉ thấy của bản thân)</option>
                    <option value="ALWAYS">User thấy tất cả Submission</option>
                    <option value="SOLVED">User chỉ thấy Sub bản thân, nếu giải được sẽ thấy Sub người khác.</option>
                    <option value="ONLY_OWN">User chỉ thấy Sub của bản thân</option>
                    <option value="HIDDEN">Không cho phép xem chi tiết Sub</option>
                  </Form.Select>
              </Col>

              <Col xl={12}><sub>
                Chính sách hiển thị chi tiết Submission của Problem này cho các User bình thường.
              </sub></Col>
            </Row>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="2" className="constraints-scoring">
          <Accordion.Header>Rằng buộc và scoring</Accordion.Header>
          <Accordion.Body>
            <Row>
              <Form.Label column="sm" xs={4}> Time Limit (s)</Form.Label>
              <Col> <Form.Control size="sm" type="text" placeholder="1.0" id="time_limit"
                      value={data.time_limit} onChange={(e) => this.inputChangeHandler(e)}
              /></Col>
            </Row>
            <Row>
              <Form.Label column="sm" xs={4}> Memory Limit (KBs)</Form.Label>
              <Col>
              <Form.Control size="sm" type="number" placeholder="256000" id="memory_limit"
                      value={data.memory_limit} onChange={(e) => this.inputChangeHandler(e)}
              /></Col>
            </Row>

            <sub>Những thiết lập dưới đây chỉ có tác dụng khi nộp ở bên ngoài contest (nộp ở trang Problem)</sub>
            <Row>
              <Form.Label column="sm" xs={2}> Điểm </Form.Label>
              <Col >
                <Form.Control size="sm" type="number" id="points"
                  value={data.points} onChange={(e) => this.inputChangeHandler(e)}
                />
              </Col>
            </Row>
            <Row>
              <Form.Label column="sm" xs={6}> Dừng chấm nếu có test sai </Form.Label>
              <Col xs={6}>
                <Form.Control size="sm" type="checkbox" id="short_circuit"
                  checked={data.short_circuit} onChange={(e) => this.inputChangeHandler(e, {isCheckbox: true})}
                />
              </Col>
              <Col xl={12}>
                <sub>Dừng chấm bài nếu submission cho ra một test cho kết quả không được chấp nhận.</sub>
              </Col>
            </Row>
            <Row>
              <Form.Label column="sm" xs={6}> Cho phép ăn điểm từng test </Form.Label>
              <Col xs={6}>
                <Form.Control size="sm" type="checkbox" id="partial"
                  checked={data.partial} onChange={(e) => this.inputChangeHandler(e, {isCheckbox: true})}
                />
              </Col>
              <Col xl={12}>
                <sub>Cho phép ăn điểm theo từng test đúng. Nếu không tick thì người dùng chỉ có thể được 0đ hoặc full điểm.</sub>
              </Col>
            </Row>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <hr className="m-2" />

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
let wrapped = GeneralDetails;
wrapped = withNavigation(wrapped);
export default wrapped;
