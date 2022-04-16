import React from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';

import authClient from 'api/auth/auth';
import SpinLoader from 'components/SpinLoader/SpinLoader';
import ErrorBox from 'components/ErrorBox/ErrorBox';

import './SignIn.scss';

import { LS_ACCESS_TOKEN, LS_REFRESH_TOKEN } from 'constants/localStorageKeys';
import {log, error} from 'helpers/logger';

export default class SignIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            submitted: false,
            errors: [],
        }
    }

    usernameChangeHandler(newUsername) {
        this.setState({username: newUsername})
    }
    passwordChangeHandler(newPassword) {
        this.setState({password: newPassword})
    }
    updateSubmitted(bool) {
        this.setState({submitted: bool})
    }
    updateErrors(newErrors) {
        this.setState({errors: newErrors})
    }

    submitHandler(e) {
        e.preventDefault();
        if (this.state.submitted) {
            log('Already submitted. Please wait for response.');
            return false;
        }
        this.updateSubmitted(true);

        const data = this.state;
        authClient.signIn(data)
            .then((res) => {
                log(res);
                localStorage.setItem(LS_ACCESS_TOKEN, res.data.access);
                localStorage.setItem(LS_REFRESH_TOKEN, res.data.refresh);
            })
            .catch((err) => {
                error(err);
                log(err.response.data);
                this.updateErrors(err.response.data);
            })
            .finally(() => {
                this.updateSubmitted(false);
            })
    }

    render() {
        const {errors} = this.state;

        return (
            <Form className="sign-in-form" onSubmit={(e) => this.submitHandler(e)}>
                <fieldset className="disabled-on-submit-wrapper" disabled={this.state.submitted}>
                <h4>Sign In</h4>
                <ErrorBox errors={errors} />
                <Form.Group as={Row} className="m-3" controlId="formPlaintextUsername">
                    <Form.Label column sm="3" className="required">
                        Username
                    </Form.Label>
                    <Col sm="9">
                        <Form.Control type="input" placeholder="Enter your Username" required
                            onChange={(e) => this.usernameChangeHandler(e.target.value)}
                        />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="m-3" controlId="formPlaintextPassword">
                    <Form.Label column sm="3" className="required">
                        Password
                    </Form.Label>
                    <Col sm="9">
                        <Form.Control type="password" placeholder="Enter your Password" required
                            onChange={(e) => this.passwordChangeHandler(e.target.value)}
                        />
                    </Col>
                </Form.Group>
                <div className="d-inline">
                    <Button variant="dark" className="submit-btn" type="submit">
                        {"Sign In"}
                    </Button>
                    {this.state.submitted ? <SpinLoader size={20} margin="0 10px"/> : <></>}
                </div>
                </fieldset>
            </Form>
        )
    }
}