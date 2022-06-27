import React from 'react';
import PropTypes from 'prop-types';
import {Modal,Button} from 'react-bootstrap';

import DropdownTreeSelect from 'react-dropdown-tree-select';
import 'react-dropdown-tree-select/dist/styles.css'

const data = [
  {
    "label": "Global",
    "tagClassName": "special",
    "isDefaultValue": true,
  },{
    "label": "Bách Khoa Đà Nẵng",
    "tagClassName": "special",
    "children": [
      {
        "label": "Khoa CNTT",
        "children":[
          {
            "label": "K18",
            "children": [
              {
                "label": "18TCLC_Nhat"
              },
              {
                "label": "18TCLC_DT"
              },
              {
                "label": "18T"
              }
            ]
          }, {
            "label": "K19",
            "children": [
              {
                "label": "19TCLC_Nhat"
              },
              {
                "label": "19TCLC_DT"
              },
            ]
          },
        ]
      }, {
        "label": "Khoa DTVT",
        "children":[
          {
            "label": "K18",
            "children": [
              {
                "label": "18ABC"
              },
              {
                "label": "18DEF"
              },
              {
                "label": "18GH"
              }
            ]
          }, {
            "label": "K19",
            "children": [
              {
                "label": "19ABC"
              },
              {
                "label": "19DEF"
              },
            ]
          },
        ]
      }
    ]
  },{
    "label": "Đại học XYZ",
    "tagClassName": "special",
    "children": [
      {
        "label": "Khoa CNTT",
        "children":[
          {
            "label": "K18",
            "children": [
              {
                "label": "18TCLC_Nhat"
              },
              {
                "label": "18TCLC_DT"
              },
              {
                "label": "18T"
              }
            ]
          }, {
            "label": "K19",
            "children": [
              {
                "label": "19TCLC_Nhat"
              },
              {
                "label": "19TCLC_DT"
              },
            ]
          },
        ]
      }, {
        "label": "Khoa DTVT",
        "children":[
          {
            "label": "K18",
            "children": [
              {
                "label": "18ABC"
              },
              {
                "label": "18DEF"
              },
              {
                "label": "18GH"
              }
            ]
          }, {
            "label": "K19",
            "children": [
              {
                "label": "19ABC"
              },
              {
                "label": "19DEF"
              },
            ]
          },
        ]
      }
    ]
  }
]

class SwitchOrgModal extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {show, setShow} = this.props;

    return (
      <Modal
        show={show}
        onHide={() => setShow(false)}
        // dialogClassName="modal-90w
        // size="lg"
        aria-labelledby="switch-org-modal"
        // centered
      >
        <Modal.Header>
          <Modal.Title id="switch-org-modal">
            Đổi tư cách hiển thị
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="flex-center-col">
          <p>
            Bạn đang xem với tư cách là thành viên của:
          </p>
          <DropdownTreeSelect data={data} mode="radioSelect" />
          <p>
            Đổi thiết lập bên trên để có thể xem các tài nguyên mà chỉ
            chia sẻ riêng tư cho một số tổ chức nhất định.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={()=>setShow(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
  )}
}

SwitchOrgModal.propTypes = {
  show: PropTypes.bool,
  setShow: PropTypes.func,
}

export default SwitchOrgModal;
