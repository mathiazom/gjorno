import React from 'react';
import MyLoggedActivity from './MyLoggedActivity';
import axios from 'axios';

export default class MyLoggedActvitites extends React.Component {
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
     * We only render 3 activities. If there are more we take the three of the most recent.
     */
    renderAllActivities() {
        let log = this.state.logged.concat(this.state.registered)
        log.sort(this.compare)
        if (log.length <= 3) {
            return log.reverse().map((activity) => (
                activity.username == this.props.username ? null : <MyLoggedActivity data={activity} key={activity.has_registration? activity.starting_time : activity.log_timestamp} />
           ));
        } else {
            const l = log.length;
            const list = [
                log[l-1],
                log[l-2], 
                log[l-3]
            ];
            return (list.map((activity) => (
                <MyLoggedActivity data={activity} key={activity.has_registration? activity.starting_time : activity.log_timestamp} />
            )));
        }
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
            <div className="container-fluid w-100 p-0 ps-md-5">
                <h2>Logg</h2>
                <div>
                    {this.renderAllActivities()}
                    <button className="btn btn-outline-success w-100 mb-4 ps-3 pe-3">Vis alle</button>
                </div>
            </div>
        );
    }
}
