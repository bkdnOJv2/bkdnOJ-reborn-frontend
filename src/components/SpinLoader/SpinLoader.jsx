import React from 'react';

import loader from 'assets/common/loading.gif';

export default class SpinLoader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            size: props.size || "20px",
            margin: props.margin || "0 10px",
        }
    }

    render() {
        const { size, margin } = this.state;
        return (
            <img src={loader} style={{ width: size, height: size, margin }}/>
        )
    }
}