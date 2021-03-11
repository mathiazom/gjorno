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
            }).catch(error => {
                console.log(error.response);
            });
        
        axios.get("http://localhost:8000/api/users/")
            .then(res => {
                const temp = res.data;
                for (const user in temp) {
                    if (temp[user].username == this.state.data.username) {
                        console.log(res.data[user])
                        this.setState({user: res.data[user]});
                        console.log(this.state.user)
                    }
                }
            }).catch(error => {
                console.log(error.response);
            }); 
    }

    render() {
        return(
            <div className="container-fluid w-75 mt-5">
            <div className="row">
                <div className="col-md-3">
                    <ActivityHost userdata = {this.state.user}/>
                </div>
                <div className="col mt-5 mt-md-0">
                    <DetailedActivity activity = {this.state.data} />
                </div>
            </div>
        </div>
        );
    }
}

export default withRouter(ActivityDetails);
