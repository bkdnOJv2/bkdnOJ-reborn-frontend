import React from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Form, Row, Col, Button, Accordion
} from 'react-bootstrap';

import contestAPI from 'api/contest';
import { SpinLoader, ErrorBox } from 'components';
import { withNavigation } from 'helpers/react-router';

class General extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ckey: this.props.ckey,
      data: this.props.data,
      errors: null,
    }
  }

  // -------------- Setters Getters
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

  // -------------- apis
  refetch(){
    if (this.props.refetch) this.props.refetch()
  }

  // ------------- Lifecycle
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.data !== this.props.data) {
      this.setState({ data: this.props.data, })
    }
  }

  // ------------- form submit
  formSubmitHandler(e) {
    e.preventDefault();

    this.setState({errors: null})

    let sendData = this.state.data;

    contestAPI.updateContest({key: this.state.ckey, data: sendData})
    .then((results) => {
      toast.success("OK Saved.")
      if (results.data.key !== this.state.ckey)
        this.props.navigate(`/admin/contest/${results.data.key}`);
      else this.props.refetch();
    }).catch((err) => {
      console.log(err.response.data);
      this.setState({ errors: err.response.data })
    })
  }

  render() {
    const { data } = this.state;

    return (
      <>
      <ErrorBox errors={this.state.errors} />
      <Form id="contest-general" onSubmit={(e) => this.formSubmitHandler(e)}>
            <Row>
              <Form.Label column="sm" lg={1} > ID </Form.Label>
              <Col lg={1}> <Form.Control size="sm" type="text" placeholder="Contest id" id="id"
                      value={data.id || ''} disabled readOnly
              /></Col>

              <Form.Label column="sm" lg={1} className="required"> Key </Form.Label>
              <Col lg={2}> <Form.Control size="sm" type="text" placeholder="Contest key/shortname/code" id="key"
                      value={data.key || ''} onChange={(e)=>this.inputChangeHandler(e)}
              /></Col>
              <Form.Label column="sm" lg={1} className="required"> Name </Form.Label>
              <Col> <Form.Control size="sm" type="text" placeholder="Contest Name" id="name"
                      value={data.name || ''} onChange={(e)=>this.inputChangeHandler(e)}
              /></Col>
            </Row>

            <Row>
              <Form.Label column="sm" md={2} className="required"> Start Time </Form.Label>
              <Col md={4}> <Form.Control size="sm" type="datetime-local" id="start_time"
                      value={this.getTime('start_time') || ''}
                      onChange={(e)=>this.setTime(e.target.id, e.target.value)}
              /></Col>

              <Form.Label column="sm" md={2} className="required"> End Time </Form.Label>
              <Col md={4}> <Form.Control size="sm" type="datetime-local" id="end_time"
                      value={this.getTime('end_time') || ''}
                      onChange={(e)=>this.setTime(e.target.id, e.target.value)}
              /></Col>

              <Col xl={12}>
                <sub>
                  Giới hạn thời gian làm bài cho tham dự chính thức (Live Participation).
                </sub>
              </Col>
            </Row>

            <Row>
              <Form.Label column="sm" md={3}> Time Limit (phút) </Form.Label>
              <Col md={9}> <Form.Control size="sm" id="time_limit"
                      value={data.time_limit || ''} onChange={(e)=>this.inputChangeHandler(e)}
              />
              </Col>
              <Col xl={12}>
                <sub>
                  Giới hạn thời gian làm bài cho mỗi lần tham dự. Nếu nhập một số nguyên,
                  mỗi lần tham dự thí sinh chỉ được làm bài từ Thời gian Tham dự cộng <code>time_limit</code>.
                  Option này chủ yếu dành cho Virtual Participation (chưa triển khai).
                </sub>
              </Col>
            </Row>

            <Row>
              <Form.Label column="sm" md={3}> Contest Format </Form.Label>
              <Col md={9}>
                  <Form.Select aria-label={data.format_name}
                    value={data.format_name || 'default'}
                    onChange={e => this.inputChangeHandler(e)}
                    size="sm" id="format_name"
                    className="mb-1"
                  >
                    <option value="default">Mặc định (tương tự ioi)</option>
                    <option value="icpc">ICPC</option>
                    <option value="ioi16">IOI (sau 2016)</option>
                    <option value="ioi">IOI (trước 2016)</option>
                  </Form.Select>
              </Col>

              <Form.Label column="sm" xl={12}> Contest Format Custom Config </Form.Label>
              <Col> <Form.Control size="sm" xl={12} type="textarea" placeholder="JSON - Describe custom contest rules" id="format_config"
                      value={data.format_config || ''} onChange={(e) => this.inputChangeHandler(e)}
              /></Col>
            </Row>

            <Row>
              <Form.Label column="sm" xl={12}> Mô tả </Form.Label>
              <Col> <Form.Control size="sm" xl={12} type="textarea" placeholder="Contest Description" id="description"
                      value={data.description || ''} onChange={(e) => this.inputChangeHandler(e)}
              /></Col>
            </Row>

        <Accordion defaultActiveKey="-1">
          <Accordion.Item eventKey="0" className="options">
            <Accordion.Header>Lựa chọn thêm</Accordion.Header>
            <Accordion.Body>

              <Row>
                <Form.Label column="sm" md={4}> Làm tròn điểm (đến số thập phân) </Form.Label>
                <Col > <Form.Control size="sm" type="number" id="points_precision"
                        value={data.points_precision || 6} onChange={(e)=>this.inputChangeHandler(e)}
                />
                </Col>
              </Row>

              <Row>
                <Form.Label column="sm" xs={6}> Chấm bằng Pretest? </Form.Label>
                <Col xs={6}> <Form.Control size="sm" type="checkbox" id="run_pretests_only"
                        checked={data.run_pretests_only || false}
                        onChange={(e)=>this.inputChangeHandler(e, {isCheckbox: true})}
                /></Col>
              </Row>

              <Row>
                <Form.Label column="sm" xs={6}> Cho phép Thi sinh gửi yêu cầu Clarifications? </Form.Label>
                <Col xs={6}> <Form.Control size="sm" type="checkbox" id="use_clarifications"
                        checked={data.use_clarifications || false}
                        onChange={(e)=>this.inputChangeHandler(e, {isCheckbox: true})}
                /></Col>
              </Row>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="1" className="accessibility">
            <Accordion.Header>Quyền truy cập</Accordion.Header>
            <Accordion.Body>
              <Row>
                <Form.Label column="sm" xs={6}> Hiển thị công khai? </Form.Label>
                <Col xs={6}> <Form.Control size="sm" type="checkbox" id="is_visible"
                        checked={data.is_visible || false}
                        onChange={(e)=>this.inputChangeHandler(e, {isCheckbox: true})}
                /></Col>
                <Col xl={12}>
                  <sub>Cho phép mọi người nhìn thấy và xem contest.</sub>
                </Col>
              </Row>

              <Row>
                <Form.Label column="sm" sm={3} className="required"> Authors </Form.Label>
                <Col sm={9}> <Form.Control size="sm" type="text" placeholder="authors" id="authors"
                        value={JSON.stringify(data.authors)} disabled
                /></Col>
                <Col xl={12}>
                  <sub>Sẽ được quyền xem và chỉnh sửa Contest. Tên tác giả sẽ được hiển thị công khai.</sub>
                </Col>

                <Form.Label column="sm" sm={3}> Collaborators </Form.Label>
                <Col sm={9}> <Form.Control size="sm" type="text" placeholder="collaborators" id="collaborators"
                        value={JSON.stringify(data.collaborators)} disabled
                /></Col>
                <Col xl={12}>
                  <sub>Sẽ được quyền xem và chỉnh sửa Contest. Tên cộng tác viên sẽ không được hiển thị công khai.</sub>
                </Col>

                <Form.Label column="sm" sm={3}> Reviewers </Form.Label>
                <Col sm={9}> <Form.Control size="sm" type="text" placeholder="reviewers" id="reviewers"
                        value={JSON.stringify(data.reviewers)} disabled
                /></Col>
                <Col xl={12}>
                  <sub>Chỉ được quyền xem và nộp bài trong Contest.</sub>
                </Col>
                <Col xl={12}>
                  <sub>Các bài nộp của những thành viên này sẽ không được nhìn thấy bởi Thí sinh và họ sẽ bị ẩn trên bảng xếp hạng.</sub>
                </Col>
              </Row>

              <Row>
                <Form.Label column="sm" xs={6}> Contest riêng cho Thí sinh? </Form.Label>
                <Col xs={6}> <Form.Control size="sm" type="checkbox" id="is_private"
                        checked={data.is_private || false}
                        onChange={(e)=>this.inputChangeHandler(e, {isCheckbox: true})}
                /></Col>

                <Form.Label column="sm" xs={3}> Thí sinh riêng </Form.Label>
                <Col xs={9}> <Form.Control size="sm" type="text" placeholder="Contestants" id="private_contestants"
                        value={JSON.stringify(data.private_contestants)} disabled
                /></Col>
                <Col xl={12}>
                  <sub>Cho phép các người dùng được thêm có thê truy cập và tham dự Contest với tư cách Thí sinh.</sub>
                </Col>
              </Row>

              <Row>
                <Form.Label column="sm" xs={6}> Contest riêng cho Tổ chức? </Form.Label>
                <Col xs={6}> <Form.Control size="sm" type="checkbox" id="is_organization_private"
                        checked={data.is_organization_private || false}
                        onChange={(e)=>this.inputChangeHandler(e, {isCheckbox: true})}
                /></Col>

                <Form.Label column="sm" xs={3}> Tổ chức riêng </Form.Label>
                <Col xs={9}> <Form.Control size="sm" type="text" placeholder="organizations" id="organizations"
                        value={JSON.stringify(data.organizations)} disabled
                /></Col>
                <Col xl={12}>
                  <sub>Cho phép thành viên của các tổ chức được thêm có thể truy cập và tham dự contest với tư cách Thí sinh.</sub>
                </Col>
              </Row>

              <Row>
                <Form.Label column="sm" xs={3}> Cấm những thí sinh này </Form.Label>
                <Col xs={9}> <Form.Control size="sm" type="text" placeholder="Contestants" id="private_contestants"
                        value={JSON.stringify(data.private_contestants)} disabled
                /></Col>
              </Row>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="2" className="rating">
            <Accordion.Header>Rating</Accordion.Header>
            <Accordion.Body>

              <Row>
                <Form.Label column="sm" > Is Rated? </Form.Label>
                <Col > <Form.Control size="sm" type="checkbox" id="is_rated"
                        checked={data.is_rated || false}
                        onChange={(e)=>this.inputChangeHandler(e, {isCheckbox: true})}
                /></Col>
              </Row>

              <Row>
                <Form.Label column="sm" sm={3}> Rating Floor </Form.Label>
                <Col sm={3}> <Form.Control size="sm" type="number" placeholder="0" id="rating_floor"
                        value={data.rating_floor || ''} onChange={(e)=>this.inputChangeHandler(e)}
                /></Col>

                <Form.Label column="sm" sm={3}> Rating Ceiling </Form.Label>
                <Col sm={3}> <Form.Control size="sm" type="number" placeholder="999999" id="rating_ceiling"
                        value={data.rating_ceiling || ''} onChange={(e)=>this.inputChangeHandler(e)}
                /></Col>
              </Row>

              <Row>
                <Form.Label column="sm" > Rate For All </Form.Label>
                <Col > <Form.Control size="sm" type="checkbox" id="rated_all"
                        checked={data.rated_all || false}
                        onChange={(e)=>this.inputChangeHandler(e, {isCheckbox: true})}
                /></Col>
                <Col xl={12}>
                  <sub>Điều chỉnh rating cả những thí sinh có tham dự nhưng không nộp bài.</sub>
                </Col>
              </Row>

              <Row>
                <Form.Label column="sm" xs={3}> Không Rate những thí sinh này </Form.Label>
                <Col xs={9}> <Form.Control size="sm" type="text" placeholder="[]" id="rate_exclude"
                        value={JSON.stringify(data.rate_exclude)} disabled
                /></Col>
                <Col xl={12}><sub>
                  Ngoài ra, các Thí sinh bị cấm thi (banned) và tước quyền thi đấu (disqualified) sẽ không được rate.
                </sub></Col>
              </Row>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        <Row>
          <Col xs={9}>
            <sub>**Các thiết lập khác sẽ được thêm sau.</sub>
          </Col>
          <Col xs={3}>
            <Button variant="dark" size="sm" type="submit" >
              Save
            </Button>
          </Col>
        </Row>
      </Form>
      </>
    )
  }
};

let wrapped = General;
wrapped = withNavigation(wrapped);
export default wrapped;
