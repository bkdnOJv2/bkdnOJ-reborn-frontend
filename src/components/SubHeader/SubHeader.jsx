import React from 'react';
import './SubHeader.scss';
import { Container } from 'react-bootstrap';

export default class SubHeader extends React.Component {
	render() {
		return (
			<div className='subheader expand-sm'>
				<Container>
					<div className='float-left'>
						<span>This Is</span>
						<span>Float Left</span>
						<span>Components</span>
					</div>
					<div className='float-right'>
						<span>Float Right</span>
					</div>
				</Container>
			</div>
		)
	}
}