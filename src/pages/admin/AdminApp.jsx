import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import { Link, Outlet } from 'react-router-dom';

import './AdminApp.scss';

class AdminApp extends React.Component {
    render() {
        return (
            <Container>
                <Row>
                    <Col xs={3}>
                        <nav className="admin-nav shadow">
                            <h3 >Temp Admin Page</h3>
                            <ul>
                                <li className="text-truncate">
                                    <Link to="">Dashboard</Link>
                                </li>
                                <li className="text-truncate">
                                    <Link to="problem">Problems</Link>
                                </li>
                                <li className="text-truncate">
                                    <Link to="submission">Submissions</Link>
                                </li>
                                <li className="text-truncate">
                                    <Link to="judges">Judges</Link>
                                </li>
                            </ul>
                        </nav>
                    </Col>
                    <Col xs={9}>
                        <Outlet/>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default AdminApp;