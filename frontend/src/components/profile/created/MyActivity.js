import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Information card for activity created by logged in user
 */
export default class MyActivity extends React.Component {

    /**
     * We take in some props (title and description) to make the Activity.
     * This activity is the one stored on the users profile.
     *
     * @param {*} props
     */
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="card w-100 mt-4 mb-4 ps-3 pe-3">
                <div className="card-body d-flex row">
                    <div className={"col pt-2 pb-2"}>
                    <Link to={`/activity/${this.props.activity.id}`} className={"no-decoration"}>
                        <h5 className="card-title text-success">{this.props.activity.title}</h5>
                    </Link>
                        <p className="card-text">{this.props.activity.ingress}</p>
                    </div>
                    <div className={"col-2 d-none d-md-flex justify-content-end align-items-center"}>
                        <Link title="Rediger aktivitet" to={`/activity/${this.props.activity.id}/edit`} className={"btn btn-success"}><i className="fas fa-pen"/></Link>
                    </div>
                    <div className={"col-12 d-md-none mt-2 mb-2"}>
                        <Link to={`/activity/${this.props.activity.id}/edit`} className={"btn btn-success w-100"}>Rediger</Link>
                    </div>
                </div>
            </div>
        );
    }
}
