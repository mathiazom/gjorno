import React from 'react';
import { Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/js/all.js';

export default class MyActivity extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        console.log(this.props.data);

        return (
            <div className="card w-100 mt-4 mb-4 ps-3 pe-3">
                <div className="card-body d-flex row">
                    <div className={"col pt-2 pb-2"}>
                        <h5 className="card-title text-success">{this.props.data.title}</h5>
                        <p className="card-text">{this.props.data.description}</p>
                    </div>
                    <div className={"col-2 d-none d-md-flex justify-content-end align-items-center"}>
                        <Link to={`/edit-activity/${this.props.data.id}`} className={"btn btn-success"}><i className="fas fa-pen"/></Link>
                    </div>
                    <div className={"col-12 d-md-none mt-2 mb-2"}>
                        <Link to={`/edit-activity/${this.props.data.id}`} className={"btn btn-success w-100"}>Rediger</Link>
                    </div>
                </div>
            </div>
        );
    }
}
