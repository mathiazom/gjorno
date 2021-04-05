import React from 'react';
import MyLoggedActivity from './MyLoggedActivity';
import { Link } from 'react-router-dom';

export default class MyLoggedActivities extends React.Component {

    /**
     * We only render 3 activities. If there are more we take the three of the most recent.
     */
    renderAllActivities() {
        let logged_activities = this.props.logged.concat(this.props.registered)
        logged_activities.sort(this.compare)
        if (logged_activities.length <= 3) {
            return logged_activities.reverse().map((logged_activity) => (
                logged_activity.username === this.props.username ? null : <MyLoggedActivity logged_activity={logged_activity} key={logged_activity.log_id} />
           ));
        } else {
            const l = logged_activities.length;
            const list = [
                logged_activities[l-1],
                logged_activities[l-2],
                logged_activities[l-3]
            ];
            return (list.map((log) => (
                <MyLoggedActivity log={log} key={log.has_registration? log.starting_time : log.log_timestamp} />
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
            <div className="container-fluid w-100 p-0 ps-md-5 mb-5">
                <h2>Logg</h2>
                <div>
                    {this.renderAllActivities()}
                    {(this.props.logged.length + this.props.registered.length) === 0 &&
                    <div className={"card"}>
                        <div className={"card-body p-4 d-flex"}>
                            <i className="fas fa-info-circle fa-lg text-muted align-self-center me-4"/>
                            <p className="text-muted fs-6 m-0">Loggen er tom! <br/>Registrer deg eller fullfør en aktivitet, så dukker den opp her!</p>
                        </div>
                    </div>
                    }
                    {(this.props.logged.length + this.props.registered.length) <= 3 ? null : <Link title="Vis alle" to={`/profile/log`} className={"btn btn-outline-success w-100 mb-4 ps-3 pe-3"}>Vis alle</Link>}
                </div>
            </div>
        );
    }
}


