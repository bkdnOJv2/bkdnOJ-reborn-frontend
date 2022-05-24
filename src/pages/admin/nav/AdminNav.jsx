import React from 'react';
import { Link } from 'react-router-dom';
import { VscListOrdered, VscFileCode, VscServer } from 'react-icons/vsc';
import './AdminNav.scss';

export default class AdminNav extends React.Component {
  render() {
    return (
      <ul className="admin-nav nav navbar-nav sidebar" id="admin-sidebar">
        <Link to='' className='sidebar-brand brand'>Admin Page</Link>

        <hr className="sidebar-divider "/>

        <li className='nav-item'>
          <Link to='problem' className='nav-link'>
            <VscListOrdered className='icon'/>
            Problems
          </Link>
        </li>
        <li className='nav-item'>
          <Link to='submission' className='nav-link'>
            <VscFileCode className='icon'/>
            Submissions
          </Link>
        </li>
        <li className='nav-item'>
          <Link to='judge' className='nav-link'>
            <VscServer className='icon'/>
            Judges
          </Link>
        </li>
      </ul> 
    )
  }
}