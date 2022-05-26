import React from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import { Link, Outlet } from 'react-router-dom';

import { VscThreeBars } from 'react-icons/vsc';

import {addClass, removeClass} from 'helpers/dom_functions.js';
import AdminNav from './nav/AdminNav';
import './AdminApp.scss';

class AdminApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {sidebarClosed: false}
  }
  hideSidebar() {
    let sidebar = document.getElementById('admin-sidebar')
    const bool = this.state.sidebarClosed;
    this.setState({sidebarClosed: !bool}, () => {
      if (bool) removeClass(sidebar, 'd-none')
      else addClass(sidebar, 'd-none')
    })
  }

  render() {
    return (
      <div className="admin-page">
        <AdminNav className="d-none"/>
        <div id="admin-content-wrapper" >
          <div id="admin-topbar" className="shadow">
            <Button variant="light" onClick={() => this.hideSidebar()}
              id="sidebar-toggle-btn"
            ><VscThreeBars /></Button>
            <span>Hello</span>

          </div>
          <Container id="admin-panel-container">
            <Outlet/>
          </Container>
        </div>
      </div>
    )
  }
}

export default AdminApp;
