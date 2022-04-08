import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import {Navbar} from './components/index.js'

ReactDOM.render(
  <React.StrictMode>
    <Navbar/>
    <p>Hello, world!</p>
  </React.StrictMode>,
  document.getElementById('root')
);
