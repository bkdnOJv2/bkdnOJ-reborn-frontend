import React from 'react';
import { log } from 'helpers/logger';

import './ErrorBox.scss';

class ErrorList extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            errTitle: props.errTitle,
            errData: props.errData,
        }
    }

    render() {
        const { errTitle, errData } = this.state;
        if (errData instanceof Array) 
            return (
                <>{
                    errData.map((err, idx) => <p key={`${errTitle}-${idx}`}>{err}</p>)
                }</>
            )
        else 
            return <p>{errData}</p>
    }
}

export default class ErrorBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = { errors: props.errors, }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.errors !== prevState.errors)
            return { errors: nextProps.errors };
        return null; 
    }

    render() {
        const { errors } = this.state;
        if (errors)
            return (
                <div className="error-box">
                    {
                        Object.keys(errors).map((key, idx) => {
                            return (
                                <div key={idx} className="error-sub">
                                    <h5 key={idx} className="error-sub-title">{key}</h5>
                                    <ErrorList errTitle={key} errData={errors[key]}/>
                                </div>
                            )
                        })
                    }
                </div>
            )
        else
            return <></>
    }
}