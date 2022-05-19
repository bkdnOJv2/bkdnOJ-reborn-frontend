import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { log } from 'helpers/logger';

import './OneColumn.scss';

export default class ListSidebar extends React.Component {
  render() {
    const mainContent = this.props.mainContent || (<p>This is main content</p>);

    return (
      <div className="one-column-wrapper">
        <Row>
          <Col >
            <div className="offcanvas-menu main-component shadow rounded" id="offcanvas-menu">
              { mainContent }
            </div>
          </Col>
        </Row>
      </div>
    )
  }
};
