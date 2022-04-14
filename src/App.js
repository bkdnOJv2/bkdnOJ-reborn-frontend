import React from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Navbar, Header, SubHeader, Footer, Content } from './components/index.js';
import { SignIn } from 'pages/index.js';

import ScrollToTop from 'helpers/ReactRouter/ScrollToTop';

import 'App.scss';

export default class App extends React.Component {
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