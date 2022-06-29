import React from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';
import { Accordion, Button, Table, Form, Modal, Row, Col } from 'react-bootstrap';

import {
  FaPaperPlane, FaRegFileArchive,
  FaTimes, FaFilter,
} from 'react-icons/fa';
import { AiOutlineForm, AiOutlineUpload, AiOutlineArrowRight, AiOutlinePlusCircle } from 'react-icons/ai';
import { render } from 'react-dom';

const INITIAL_STATE = {
  'search': "",
  'is_public': "False",
  'ordering': "-created",
};

export default class ProblemSearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...INITIAL_STATE,
    }
  }

  render() {
    const data = this.state;
    return(
      <Form>
        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0" className="filter">
            <Accordion.Header>Search/Filter</Accordion.Header>
            <Accordion.Body>
              <Row >
                <Form.Label column="sm" xl={2} > Search </Form.Label>
                <Col xl={10}>
                  <Form.Control size="sm" type="text" placeholder="Search (code/title)"
                      value={data.search} onChange={(e)=>this.setState({search: e.target.value})}
                /></Col>

                <Form.Label column="sm" md={2} > Thứ tự </Form.Label>
                <Col md={4}>
                    <Form.Select
                      size="sm" id="ordering" className="mb-1"
                      onChange={(e) => this.setState({ordering: e.target.value})}
                      value={data.ordering}
                    >
                      <option value="-created">Tạo gần đây nhất</option>
                      <option value="created">Tạo cách đây lâu nhất</option>
                      <option value="-modified">Chỉnh sửa gần đây nhất</option>
                      <option value="modified">Chỉnh sửa cách đây lâu nhất</option>
                      <option value="-points">Điểm giảm dần</option>
                      <option value="points">Điểm tăng dần</option>
                    </Form.Select>
                </Col>
                <Form.Label column="sm" md={2} > Public? </Form.Label>
                <Col md={4}>
                    <Form.Select
                      size="sm" id="is_public" className="mb-1"
                      value={data.is_public}
                      onChange={(e) => this.setState({is_public: e.target.value})}
                    >
                      <option value="True">Public</option>
                      <option value="False">Private</option>
                    </Form.Select>
                </Col>
              </Row>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        <Row>
          <Col >
            <span>
              Bộ lọc:{
                this.props.searchData && <>
                  <code>{JSON.stringify(this.props.searchData)}</code>
                </>
              }
            </span>
          </Col>
          <div className="d-flex flex-row-reverse">
            <Button size="sm" variant="dark" className="ml-1 mr-1 btn-svg"
              onClick={()=>this.props.setSearchData({...data})}
            >
              <FaFilter size={14}/><span className="d-none d-sm-inline">Filter</span>
            </Button>

            <Button size="sm" variant="dark" className="ml-1 mr-1 btn-svg"
              onClick={()=>this.props.setSearchData({})}
            >
              <FaTimes size={14}/><span className="d-none d-sm-inline">Clear</span>
            </Button>
          </div>
        </Row>
      </Form>
    )
  }
}

ProblemSearchForm.propTypes = {
  searchData: PropTypes.object,
  setSearchData: PropTypes.func,
}
