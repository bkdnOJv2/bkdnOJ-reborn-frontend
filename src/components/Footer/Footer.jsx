import React from 'react';
import { Container } from 'react-bootstrap';
import './Footer.scss';
import unilogo from 'assets/images/bkdn-uni-logo.jpg';

export default class Footer extends React.Component {
	render() {
		return (
			<footer className='footer'>
				<Container>
					<img className='bkdn-uni-icon' src={unilogo}/>
				</Container>
			</footer>
		)
	}
}