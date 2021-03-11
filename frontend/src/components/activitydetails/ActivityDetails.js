import React from 'react';
import axios from 'axios';
import ActivityHost from "./ActivityHost.js";
import DetailedActivity from "./DetailedActivity.js";
import {withRouter} from 'react-router-dom';

 class ActivityDetails extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            user: []
        };
        // Bind "this" to get access to "this.props.history"
        //this.activityDetails = this.activityDetails.bind(this);
    }

    componentDidMount() {
        axios.get(`http://localhost:8000/api/activities/${this.props.match.params.id}/`)
            .then(res => {
                this.setState({data: res.data})
                this.getActivityAuthor()
            }).catch(error => {
                console.log(error.response);
            });
    }
    
    getActivityAuthor() {
        axios.get(`http://localhost:8000/api/users/${this.state.data.user}`)
        .then(res => {
            this.setState({user: res.data})
        }).catch(error => {
            console.log(error.response);
        }); 
    }

    render() {
        return(
            <div className="container-fluid w-75 mt-5">
            <div className="row">
                <div className="col col-md-2 offset-sm-1">
                    <ActivityHost userdata = {this.state.user}/>
                </div>
                <div className="col col-md-7 offset-sm-1">
                    <DetailedActivity activity = {this.state.data} />
                </div>
            </div>
        </div>
        );
    }
}

export default withRouter(ActivityDetails);
