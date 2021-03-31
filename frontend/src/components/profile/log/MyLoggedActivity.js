import React from 'react';
import { Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/js/all.js';

export default class MyLoggedActivity extends React.Component {

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
                        <Link to={`/activity-details/${this.props.data.id}`} style={{textDecoration: "none"}}>
                            <h5 className="card-title text-success">{this.props.data.title}</h5>
                        </Link>
                        <p className="card-text">{this.props.data.ingress}</p>
                    </div>
                    <div className={"col-2 d-none d-md-flex justify-content-end flex-column"}>
                        {this.props.data.has_registration && (new Date(this.props.data.starting_time) - Date.now()) > 0 && <p className="card-text">Kommende</p>}
                        <p className="card-text">{this.props.data.has_registration ? 
                        new Date(this.props.data.starting_time).toISOString().slice(0, 16).replace(/-/g, ".").replace("T", " ") : 
                        new Date(this.props.data.log_timestamp).toISOString().slice(0, 16).replace(/-/g, ".").replace("T", " ")}</p>
                    </div>
                </div>
            </div>
        );
    }
}
