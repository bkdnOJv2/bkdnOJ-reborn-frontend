import React from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import './SignIn.scss';

import authClient from 'api/auth/auth';

import {log} from 'helpers/logger';

export default class SignIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
        }
    }

    usernameChangeHandler(newUsername) {
        this.setState({username: newUsername})
    }
    passwordChangeHandler(newPassword) {
        this.setState({password: newPassword})
    }

    submitHandler(e) {
        e.preventDefault();
        const data = this.state;
        authClient.signIn(data)
            .then((res) => {
                log(res)
            })
            .catch((err) => {

            })
    }

    render() {
        return (
            <Form className="sign-in-form" onSubmit={(e) => this.submitHandler(e)}>
                <h4>Sign In</h4>
                <Form.Group as={Row} className="m-3" controlId="formPlaintextUsername">
                    <Form.Label column sm="3">
                        Username
                    </Form.Label>
                    <Col sm="9">
                        <Form.Control type="input" placeholder="Enter your Username" 
                            onChange={(e) => this.usernameChangeHandler(e.target.value)}
                        />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="m-3" controlId="formPlaintextPassword">
                    <Form.Label column sm="3">
                        Password
                    </Form.Label>
                    <Col sm="9">
                        <Form.Control type="password" placeholder="Enter your Password" 
                            onChange={(e) => this.passwordChangeHandler(e.target.value)}
                        />
                    </Col>
                </Form.Group>
                <Button variant="dark" className="submit-btn" type="submit">
                    Sign In
                </Button>
            </Form>
        )
    }
}