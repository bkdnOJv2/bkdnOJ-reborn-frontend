import React from 'react';
import { Container } from 'react-bootstrap';
import flag from 'assets/images/bkdnoj-dropflag.png';
import './Header.scss';

export default class Header extends React.Component {
	render() {
		return (
			<div className='header'>
				<Container>
					<div className='site-logo d-none d-md-block'>
						<img src={flag}/>
					</div>
					<span>English</span>
					<span>Japanese</span>
					<span>Other Languages</span>
				</Container>
			</div>
		)
	}
}