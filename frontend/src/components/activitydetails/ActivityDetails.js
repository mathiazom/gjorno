import React from 'react';
import axios from 'axios';
import ActivityHost from "./ActivityHost.js";
import DetailedActivity from "./DetailedActivity.js";
import Registration from "./Registration.js";
import {withRouter} from 'react-router-dom';

class ActivityDetails extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            user: []
        };
        this.getActivity = this.getActivity.bind(this);
    }

    componentDidMount() {
        this.getActivity();
    }

    getActivity() {
        // Include auth token only if it exists (user is logged in)
        // otherwise browse the activity anonymously
        const headers = {}
        if (this.props.authenticated) {
            headers['Authorization'] = `Token ${window.localStorage.getItem("Token")}`
        }
        axios
            .get(`http://localhost:8000/api/activities/${this.props.match.params.id}/`, headers)
            .then(res => {
                this.setState({data: res.data})
                this.getActivityAuthor()
            })
            .catch(error => {
                console.log(error.response);
            });
    }

    getActivityAuthor() {
        axios
            .get(`http://localhost:8000/api/users/${this.state.data.user}`)
            .then(res => {
                this.setState({user: res.data})
            })
            .catch(error => {
                console.log(error.response);
            });
    }

    render() {
        let join;
        if (this.state.data.has_registration === true) {
            join = <Registration activity={this.state.data} onUpdate={this.getActivity}
                                 authenticated={this.props.authenticated}/>
        } else if (this.props.authenticated) {
            join = <a href="#" className="btn btn-success w-100 mt-3">Legg i logg</a>
        }
        return (
            <div className="container-fluid w-80 mt-5 mb-5">
                <div className="row">
                    <div className="col col-md-2 offset-sm-1">
                        <ActivityHost userdata={this.state.user}/>
                        {join}
                    </div>
                    <div className="col col-md-7 offset-sm-1">
                        <DetailedActivity activity={this.state.data}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(ActivityDetails);
