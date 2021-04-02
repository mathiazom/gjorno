import React from 'react';
import MyLoggedActivity from './MyLoggedActivity';
import { Link } from 'react-router-dom';

export default class MyLoggedActvitites extends React.Component {

    /**
     * We only render 3 activities. If there are more we take the three of the most recent.
     */
    renderAllActivities() {
        let log = this.props.logged.concat(this.props.registered)
        log.sort(this.compare)
        if (log.length <= 3) {
            return log.reverse().map((activity) => (
                activity.username === this.props.username ? null : <MyLoggedActivity data={activity} key={activity.has_registration? activity.starting_time : activity.log_timestamp} />
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
            <div className="container-fluid w-100 p-0 ps-md-5 mb-5">
                <h2>Logg</h2>
                <div>
                    {this.renderAllActivities()}
                    {(this.props.logged.length + this.props.registered.length) === 0 ? <blockquote className="blockquote"><p className="mt-2 mb-5">Loggen er tom! Registrer deg eller fullfør en aktivitet, så dukker den opp her!</p></blockquote> : null}
                    {(this.props.logged.length + this.props.registered.length) <= 3 ? null : <Link title="Vis alle" to={`/profile/log`} className={"btn btn-outline-success w-100 mb-4 ps-3 pe-3"}>Vis alle</Link>}
                </div>
            </div>
        );
    }
}
