import React from 'react';

export default class MyActivity extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="card w-100 mt-4 mb-4 ps-3 pe-3">
                <div className="card-body d-flex row">
                <h5 className="card-title text-success">{this.props.data.title}</h5>
                <p className="card-text">{this.props.data.description}</p>
                </div>
            </div>
        );
    }
}