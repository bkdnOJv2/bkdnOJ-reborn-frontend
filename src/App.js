// Lib Imports
import React from 'react';
import { connect } from 'react-redux';
import { Container } from 'react-bootstrap';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { unstable_HistoryRouter as HistoryRouter } from "react-router-dom";
import { createBrowserHistory } from "history";

// Helpers
import ScrollToTop from 'helpers/react-router/ScrollToTop';

// Components
import { ListSidebar, OneColumn } from 'layout';
import { Navbar, Header, SubHeader, Footer, Content } from './components';
import PDFViewer from 'components/PDFViewer/PDFViewer';

import { SignIn, SignUp, SignOut, UserProfile } from 'pages';
import {
  SubmissionList, SubmissionDetails, ProblemList, 
  ProblemDetails, JudgeStatuses, Submit
} from 'pages/user';

import {
  AdminProblemDetails, AdminProblemList,
  AdminApp
} from 'pages/admin';

import UserApp from 'pages/user/UserApp';
import { setTitle } from 'helpers/setTitle';

// Styles
import 'App.scss';

const history = createBrowserHistory({ window });

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: (this.props.user && this.props.user.user),
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.user !== this.props.user) {
      this.setState({user: (this.props.user && this.props.user.user)})
    }
  }

  isAuthenticated() {
    return (!!this.state.user)
  }
  isAdmin() {
    return this.isAuthenticated() && this.state.user.is_staff;
  }

  render() {
    return (
      <HistoryRouter history={history}>
        <Routes>
          {
            this.isAdmin() && 
            <>
              <Route path="/admin" element={<AdminApp />}>
                <Route index path="" element={
                  <div className="shadow text-dark d-flex d-flex flex-column justify-content-center text-center"
                    style={{minHeight: "400px"}}>
                      <h4>Admin Home Page</h4>
                  </div>
                }/>
                <Route path="problem" element={
                  <OneColumn mainContent={<AdminProblemList />} />
                }/>
                <Route path="problem/:shortname" element={
                  <OneColumn mainContent={<AdminProblemDetails />} />
                }/>
                <Route path="*" element={
                  <div className="shadow text-dark d-flex d-flex flex-column justify-content-center text-center"
                    style={{minHeight: "400px"}}>
                      <h4>Not Implemented</h4>
                  </div>
                }/>
              </Route>
            </>
          }
          <Route path="" element={<UserApp />}>
            <Route index path="/" element={<Content />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/sign-out" element={<SignOut />} />
            <Route path="/profile" element={<UserProfile />} />

            <Route path="/test/pdf" element={ <PDFViewer /> } />

            <Route path="/problem" element={
              <ListSidebar mainContent={<ProblemList />}/>
            } />
            <Route path="/problem/:shortname" 
              element={<ListSidebar mainContent={<ProblemDetails />} />}
            />
            <Route path="/problem/:shortname/submit" 
              element={<ListSidebar mainContent={<Submit />} />}
            />

            <Route path="/submission" element={
              <ListSidebar mainContent={<SubmissionList />}/>
            } />
            <Route path="/submission/:id" element={
              <ListSidebar mainContent={<SubmissionDetails />}/>
            } />
            <Route path="/judge-status" element={
              <ListSidebar mainContent={<JudgeStatuses />}/>
            } />
          </Route>

          <Route path="*" element={
            <Container>
              <div className="shadow text-dark d-flex d-flex flex-column justify-content-center text-center"
                style={{minHeight: "200px", minWidth: "400px"}}>
                  <h4 style={{color: 'white'}}>404 | Page Not Found</h4>
              </div>
            </Container>
          } />
        </Routes>
      </HistoryRouter>
    )
  }
} 
const mapStateToProps = state => {
    return {
        user : state.user.user
    }
}
export default connect(mapStateToProps, null)(App);