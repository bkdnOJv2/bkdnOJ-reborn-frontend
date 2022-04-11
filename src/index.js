import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import {Navbar, Header, SubHeader, Footer} from './components/index.js';
import {Container} from 'react-bootstrap';

ReactDOM.render(
  <React.StrictMode>
    <Header/>
    <Navbar/>
    <SubHeader/>

    <Container style={{marginTop: "40px", border: "solid", height: "1200px"}}>
      Hello!
    </Container>

    <Footer/>
  </React.StrictMode>,
  document.getElementById('root')
);
