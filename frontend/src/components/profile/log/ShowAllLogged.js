import React from 'react';
import MyLoggedActivity from './MyLoggedActivity';
import axios from 'axios';
import {updatePageTitle} from "../../common/Utils";

export default class ShowAllLogged extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            logged: [],
            registered: []
        }
    }

    /**
     * Get all the registered and logged activities for the user.
     */
     componentDidMount() {
        updatePageTitle("Mine gjennomføringer");
        this.getLoggedActivities();
        this.getRegisteredActivities();
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
            this.setState({logged: res.data});
        })
        .catch(error => {
            console.log(error.response);
        });
    }

    /**
     * Sends an API GET request to get the activities for which the user is registered.
     */
    getRegisteredActivities () {
        axios.get('/api/my_registered_activities/',
        {
            headers: {
                "Authorization": `Token ${window.localStorage.getItem("Token")}`
            }
        })
        .then(res => {
            this.setState({registered: res.data});
        })
        .catch(error => {
            console.log(error.response);
        });
    }

     /**
     * Sort the activities and add them.
     */
      renderAllActivities() {
        let logged_activities = this.state.logged.concat(this.state.registered)
        logged_activities.sort(this.compare)

        return logged_activities.reverse().map((logged_activity) => (
            logged_activity.username == this.props.username ? null : <MyLoggedActivity logged_activity={logged_activity} key={logged_activity.has_registration? logged_activity.starting_time : logged_activity.log_timestamp} />
        ));
    }

    /**
     * Compares the dates for two activities, based on whether the activity has registration or not (starting_time/log_timestamp).
     * @param {*} a1 first activity
     * @param {*} a2 second activity
     * @returns a positive integer if a1 is before a2, a negative integer if a2 is before a1, or 0 if they have the same time.
     */
    compare(a1, a2) {
        let date1 = a1.has_registration ? new Date(a1.starting_time) : new Date(a1.log_timestamp);
        let date2 = a2.has_registration ? new Date(a2.starting_time) : new Date(a2.log_timestamp);
        return date1 - date2;
    }

    render() {
        return (
            <div className="container-fluid w-75 mt-5">
                <h2>Fullstendig logg</h2>
                <div>
                    {this.renderAllActivities()}
                </div>
            </div>
        );
    }
}
