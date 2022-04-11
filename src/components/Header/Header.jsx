import React from 'react';
import { Container } from 'react-bootstrap';
import './Header.scss';

export default class Header extends React.Component {
	render() {
		return (
			<div className='header'>
				<Container>
					<div className='site-logo d-none d-md-block'>
						<img src='https://judge.u-aizu.ac.jp/onlinejudge/image/common/logo.png'/>
					</div>
					<span>English</span>
					<span>Japanese</span>
					<span>Other Languages</span>
				</Container>
			</div>
		)
	}
}