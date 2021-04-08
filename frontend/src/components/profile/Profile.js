import React from 'react';
import ProfileInfo from './ProfileInfo';
import axios from 'axios';
import './Profile.css';
import {compareActivityDates, updatePageTitle} from "../common/Utils";
import ProfileList from "./ProfileList";
import FavoriteActivity from "./favorited/FavoriteActivity";
import MyActivity from "./created/MyActivity";
import MyLogActivity from "./log/MyLogActivity";

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current_user: {},
            favorite_activities: [],
            my_activities: [],
            log: []
        }
        this.getFavoriteActivities = this.getFavoriteActivities.bind(this);
    }

    componentDidMount() {
        updatePageTitle("Min profil");
        this.getCurrentUser();
        this.getMyActivities();
        this.getFavoriteActivities();
        this.getLog();
    }

    /**
     * Retrieve current user data
     */
    getCurrentUser() {
        axios.get('http://localhost:8000/api/current_user/',
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
     * Sends an API GET request to get the activities which the user has logged,
     * as well as activities where user is registered
     */
    getLog() {
        axios.get('http://localhost:8000/api/my_logs/',
            {
                headers: {
                    "Authorization": `Token ${window.localStorage.getItem("Token")}`
                }
            })
            .then(logged_res => {
                axios.get('http://localhost:8000/api/my_registered_activities/',
                    {
                        headers: {
                            "Authorization": `Token ${window.localStorage.getItem("Token")}`
                        }
                    })
                    .then(registered_res => {
                        this.setState({
                            log: logged_res.data
                                .concat(registered_res.data)
                                .sort(compareActivityDates)
                                .reverse()
                        });
                    })
                    .catch(error => {
                        console.log(error.response);
                    });
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
        axios.get('http://localhost:8000/api/my_favorite_activities/',
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
                        <ProfileList
                            title={"Favoritter"}
                            activities={this.state.favorite_activities}
                            renderItem={(activity) => (
                                <FavoriteActivity activity={activity} key={activity.id}
                                                  onUpdate={this.getFavoriteActivities}/>
                            )}
                            showAllPath={"/profile/favorites"}
                        />
                        }
                        <ProfileList
                            title={"Mine aktiviteter"}
                            activities={this.state.my_activities}
                            renderItem={(activity) => (
                                <MyActivity activity={activity} key={activity.id}/>
                            )}
                            showAllPath={"/profile/created"}
                            emptyMessage={<>
                                Du har ikke opprettet noen aktiviteter enda. <br/>Velg <q>Ny aktivitet</q> i menyen til
                                venstre for å komme i gang.
                            </>}
                        />
                        {this.state.current_user.is_organization === false &&
                        <ProfileList
                            title={"Logg"}
                            activities={this.state.log}
                            renderItem={(logged_activity) => (
                                <MyLogActivity logged_activity={logged_activity} key={logged_activity.log_id}/>
                            )}
                            showAllPath={"/profile/log"}
                            emptyMessage={<>
                                Loggen er tom! <br/>Registrer deg eller fullfør en
                                aktivitet, så dukker den opp her!
                            </>}
                        />
                        }
                    </div>
                </div>
            </div>
        );
    }
}
