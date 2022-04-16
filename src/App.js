// Lib Imports
import React from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Helpers
import ScrollToTop from 'helpers/ReactRouter/ScrollToTop';

// Components
import { Navbar, Header, SubHeader, Footer, Content } from './components/index.js';
import { SignIn } from 'pages/index.js';

// Styles
import 'App.scss';

export default class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <BrowserRouter>
                <div className="header-wrapper">
                    <Header />
                    <Navbar />
                    <SubHeader />
                </div>

                <div className="content-wrapper">
                    <ScrollToTop />
                    <Container className="content">
                        <Routes>
                            <Route path="/" element={<Content />} />
                            <Route path="/sign-in" element={<SignIn />} />
                        </Routes>
                    </Container>
                </div>

                <div className='footer-wrapper'>
                    <Footer />
                </div>
            </BrowserRouter>
        )
    }
}