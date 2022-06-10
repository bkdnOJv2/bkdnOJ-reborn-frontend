import React from 'react';
import { Link } from 'react-router-dom';
import {
  Form, Row, Col, Table, Button
} from 'react-bootstrap';

const PROBLEMS = [
        {
            "id": 12,
            "shortname": "TREEQUERY",
            "title": "Truy vấn trên cây",
            "solved_count": 0,
            "attempted_count": 0,
            "contest": "contest2",
            "points": 100,
            "partial": true,
            "is_pretested": false,
            "order": 0,
            "output_prefix_override": 0,
            "max_submissions": null,
            "label": "1"
        },
        {
            "id": 8,
            "shortname": "HELLO",
            "title": "Hello World",
            "solved_count": 1,
            "attempted_count": 1,
            "contest": "contest2",
            "points": 100,
            "partial": false,
            "is_pretested": false,
            "order": 1,
            "output_prefix_override": null,
            "max_submissions": null,
            "label": "2"
        },
        {
            "id": 9,
            "shortname": "SNAKEGAME",
            "title": "Trò chơi con rắn",
            "solved_count": 0,
            "attempted_count": 0,
            "contest": "contest2",
            "points": 100,
            "partial": true,
            "is_pretested": false,
            "order": 2,
            "output_prefix_override": null,
            "max_submissions": null,
            "label": "3"
        }
    ];

class Problem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      problems: PROBLEMS || [],

      loaded: false,
      errors: null,
    }
  }

  clarifyPopup(msg) {
    return (
      <Link to="#" onClick={() => alert(msg)}>?</Link>
    )
  }

  formSubmitHandler(e) {
    e.preventDefault();
  }
  problemChangeHandler(idx, e, params={}) {
    const problems = this.state.problems;
    let prob = problems[idx];

    const isCheckbox = params.isCheckbox || false;
    if (!isCheckbox) prob[e.target.id] = e.target.value
    else prob[e.target.id] = !prob[e.target.id]

    this.setState({
      problems: problems.map( (p) => p===prob.id?prob:p )
    })
  }

  render() {
    const { problems } = this.state;

    return (
      <>
      <div className="table-wrapper m-2">

        <div className="options mb-1">
          <div className="border d-inline-flex p-1">
            <Button size="sm" variant="dark">Sắp xếp theo Order</Button>
          </div>
          <div className="border d-inline-flex p-1">
            <Button size="sm" variant="dark">Đánh số Order từ 0</Button>
          </div>
        </div>

        <hr className="m-2"/>

        <div className="admin-table">
        <Table responsive hover size="sm" striped bordered className="rounded mb-0">
          <thead>
            <tr>
              <th style={{whiteSpace: "nowrap"}} >
                Order {this.clarifyPopup('Quyết định thứ tự xuất hiện của các Problem ở trong Contest. '+
                  'Ngoài ra, hệ thống sử dụng giá trị Order để sinh ra nhãn (problem A, problem B,...).')}
              </th>

              <th style={{minWidth: "150px"}}>Problem Code</th>
              <th style={{minWidth: "15%"}}>Points</th>
              <th style={{whiteSpace: "nowrap"}} >
                Cắn Test {this.clarifyPopup('Chấm bài ở chế độ ăn điểm từng test (oi). Nhưng thông thường chỉ với thiết lập Contest Format là đủ.')}
              </th>
              <th style={{whiteSpace: "nowrap"}} >
                Pretested {this.clarifyPopup('Chỉ chấm với Pretest.')}
              </th>
              <th style={{whiteSpace: "nowrap"}} >
                Max Subs {this.clarifyPopup('Giới hạn số lần nộp bài tối đa cho phép. Để trống nếu cho phép nộp không giới hạn.')}
              </th>
              {/* <th >
                <Link to="#" onClick={(e) => this.handleDeleteSelect(e)}>Actions</Link>
              </th> */}
            </tr>
          </thead>
          <tbody>
          {
            problems.map((prob, ridx) =>
              <tr key={`ct-pr-${prob.shortname}`}>
                <td> <Form.Control size="sm" type="text" id="order" value={prob.order}
                                onChange={(e) => this.problemChangeHandler(ridx, e)} />
                </td>
                <td style={{minWidth: "150px"}}>
                  <Form.Control size="sm" type="text" id="shortname" value={prob.shortname}
                                onChange={(e) => this.problemChangeHandler(ridx, e)} />
                </td>
                <td> <Form.Control size="sm" type="number" id="points" value={prob.points || 0}
                                onChange={(e) => this.problemChangeHandler(ridx, e)} />
                </td>
                <td> <Form.Control size="sm" type="checkbox" id="partial" checked={prob.partial || false}
                                onChange={(e) => this.problemChangeHandler(ridx, e, {isCheckbox: true})} />
                </td>
                <td> <Form.Control size="sm" type="checkbox" id="is_pretested" checked={prob.is_pretested || false}
                                onChange={(e) => this.problemChangeHandler(ridx, e, {isCheckbox: true})} />
                </td>
                <td> <Form.Control size="sm" type="number" id="max_submissions" value={prob.max_submissions || ''}
                                onChange={(e) => this.problemChangeHandler(ridx, e)} />
                </td>
              </tr>
            )
          }
          </tbody>
        </Table>
        </div>

        <Row className="mt-2">
          <Col xs={9}></Col>
          <Col>
            <Button size="sm" variant="dark" style={{width: "100%"}}
              onClick={(e) => console.log(this.state.problems)}> Save </Button>
          </Col>
        </Row>
      </div>
      </>
    )
  }
};

let wrapped = Problem;
export default wrapped;
