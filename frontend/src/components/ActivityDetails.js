import React from 'react';
import axios from 'axios'
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
                <div className="card activity-card w-75 mx-auto mt-4 mb-4">
                <img src={"/images/placeholder.png"} className="img-fluid" alt={"bilde"}/>
                <div className="card-body d-flex row">
                    <div className={"col-12 col-lg-8 pe-4"}>
                        <h5 className="card-title text-success"> {this.state.data.title}</h5>
                        <p className="card-text">{this.state.data.description}</p>
                    </div>
                    <div className={"col-12 col-xl-4 text-end d-none d-xl-block pe-5"}>
                        <div className={"text-secondary"}>
                            <p>Publisert av <span className={"text-success"}><b>{this.state.data.username}</b></span></p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(ActivityDetails);
