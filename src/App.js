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

import { SignIn, SignUp, SignOut, UserProfile } from 'pages';
import { SubmissionList, SubmissionDetails } from 'pages/submission';
import { ProblemList, ProblemDetails } from 'pages/problem';
import { JudgeStatuses } from 'pages/judge-status';
import { Submit } from 'pages/submit';
import { setTitle } from 'helpers/setTitle';

import PDFViewer from 'components/PDFViewer/PDFViewer';

import AdminProblemDetails from 'pages/admin/problem/AdminProblemDetails';

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
        <Header />
        <Navbar />
        <SubHeader />

        <div className="content-wrapper">
          <ScrollToTop />
          <Container className="content">
            <Routes>
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

              {
                this.isAdmin() && 
                <>
                  <Route path="/admin" element={<p>Admin</p>}/>
                  <Route path="/admin/problem" element={<p>Admin Problem</p>}/>
                  <Route path="/admin/problem/:shortname" element={
                    <OneColumn mainContent={<AdminProblemDetails />} />
                  }/>
                </>
              }

              <Route path="*" element={<p>Not Found</p>} />
            </Routes>
          </Container>
        </div>

        <div className='footer-wrapper'>
          <Footer />
        </div>
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