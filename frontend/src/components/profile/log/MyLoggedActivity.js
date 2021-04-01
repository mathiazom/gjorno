import React from 'react';
import { Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/js/all.js';

export default class MyLoggedActivity extends React.Component {

    /**
     * We take in some props (title, ingress and date) to make the logged Activity.
     * This activity is the one stored on the users profile.
     * 
     * @param {*} props 
     */
    constructor(props) {
        super(props);
    }

    niceDate(dateString) {
        const months = ["januar", "februar", "mars", "april", "mai", "juni", "juli", "august", "september", "november", "desember"]
        let date = new Date(dateString).toISOString().slice(0, 16).replace(/-/g, ".").replace("T", " ")
        let time = date.slice(10,16)
        date = parseInt(date.slice(8,10)) + " " + months[date.slice(6,7)-1] + " " + date.slice(0,4)
        return date + " " + time
    }

    render() {
        return (
            <div className="card w-100 mt-4 mb-4 ps-3 pe-3">
                <div className="card-body d-flex row">
                    <div className={"col pt-2 pb-2"}>
                            <p className="card-text d-flex text-muted mb-1">{this.props.data.has_registration ? 
                            this.niceDate(this.props.data.starting_time) : 
                            this.niceDate(this.props.data.log_timestamp)}
                            {this.props.data.has_registration && (new Date(this.props.data.starting_time) - Date.now()) > 0 && <span className="badge rounded-pill ms-2 bg-primary align-self-center">Kommende</span>}</p>
                        <Link to={`/activity-details/${this.props.data.id}`} style={{textDecoration: "none"}}>
                            <h5 className="card-title text-success">{this.props.data.title}</h5>
                        </Link>
                        <p className="card-text">{this.props.data.ingress}</p>
                    </div>
                </div>
            </div>
        );
    }
}
