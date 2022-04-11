import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './Footer.scss';
import unilogo from 'assets/images/bkdn-uni-logo.jpg';

export default class Footer extends React.Component {
	render() {
		return (
			<footer className='footer'>
				<Container>
					<Row>
						<Col xs={12} md={4} className="col">
							<p>Trang chu: ...</p>
							<p>Khoa CNTT: ...</p>
							<p style={{textAlign: "center"}}><img className='bkdn-uni-icon' src={unilogo}/></p>
							<p>Đại học Bách khoa - Đại học Đà Nẵng</p>
						</Col>
						<Col xs={12} md={8} className="col">
							Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
						</Col>
					</Row>
				</Container>
			</footer>
		)
	}
}