import React from 'react';
import MyActivities from './created/MyActivities';
import ProfileInfo from './ProfileInfo';
import FavoriteActivities from './favorite/FavoriteActivities';
import axios from 'axios';
import './Profile.css';
import MyLoggedActivities from './log/MyLoggedActivities';
import {updatePageTitle} from "../common/Utils";

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current_user: {},
            favorite_activities: [],
            my_activities: [],
            logged_activities: [],
            registered_activities: []
        }
        this.getFavoriteActivities = this.getFavoriteActivities.bind(this);
    }

    componentDidMount() {
        updatePageTitle("Min profil");
        this.getCurrentUser();
        this.getMyActivities();
        this.getFavoriteActivities();
        this.getLoggedActivities();
        this.getRegisteredActivities();
    }

    /**
     * Retrieve current user data
     */
    getCurrentUser() {
        axios.get('/api/current_user/',
            {
                headers: {
                    "Authorization": `Token ${window.localStorage.getItem("Token")}`
                }
            })
            .then(res => {
                this.setState({current_user: res.data})
            }).catch(error => {
            console.log(error.response);
        });
    }

    /**
     * Collect the activities posted by the logged in user, and stores them in the current state.
     */
    getMyActivities() {
        axios.get('http://localhost:8000/api/my_activities/',
            {
                headers: {
                    "Authorization": `Token ${window.localStorage.getItem("Token")}`
                }
            })
            .then(res => {
                this.setState({my_activities: res.data});
            })
            .catch(error => {
                console.log(error.response);
            })
    }

    /**
     * Sends an API GET request to get the activities which the user has logged.
     */
    getLoggedActivities() {
        axios.get('/api/my_logged_activities/',
            {
                headers: {
                    "Authorization": `Token ${window.localStorage.getItem("Token")}`
                }
            })
            .then(res => {
                this.setState({logged_activities: res.data});
            })
            .catch(error => {
                console.log(error.response);
            });
    }

    /**
     * Sends an API GET request to get the activities for which the user is registered.
     */
    getRegisteredActivities() {
        axios.get('/api/my_registered_activities/',
            {
                headers: {
                    "Authorization": `Token ${window.localStorage.getItem("Token")}`
                }
            })
            .then(res => {
                this.setState({registered_activities: res.data});
            })
            .catch(error => {
                console.log(error.response);
            });
    }

    /**
     * Collects the activities favorited by the logged in user, and stores them in the current state.
     * Used for updating the favorites list after a change.
     */
    getFavoriteActivities() {
        axios.get('http://localhost:8000/api/my_favorited_activities/',
            {
                headers: {
                    "Authorization": `Token ${window.localStorage.getItem("Token")}`
                }
            })
            .then(res => {
                this.setState({favorite_activities: res.data});
            })
            .catch(error => {
                console.log(error.response);
            })
    }

    render() {
        return (
            <div className="container-fluid w-75 mt-5">
                <div className="row">
                    <div className="col-md-3">
                        <ProfileInfo user={this.state.current_user}/>
                    </div>
                    <div className="col mt-5 mt-md-0">
                        {this.state.favorite_activities.length > 0 &&
                        <FavoriteActivities
                            activities={this.state.favorite_activities}
                            getFavoriteActivities={this.getFavoriteActivities}
                        />
                        }
                        <MyActivities
                            activities={this.state.my_activities}
                        />
                        {this.state.current_user.is_organization === false &&
                        <MyLoggedActivities
                            logged={this.state.logged_activities}
                            registered={this.state.registered_activities}
                        />
                        }
                    </div>
                </div>
            </div>
        );
    }
}
