import React from 'react';
import MyActivity from './MyActivity';
import { Link } from 'react-router-dom';

export default class MyActivities extends React.Component {

    /**
     * We go through all the activities stored in our state from the API,
     * and we make a MyActivity with the stored data (from the MyActivity-component).
     */
    renderAllActivities() {
        if (this.props.activities.length <= 3) {
            return this.props.activities.map((activity) => (
                <MyActivity activity={activity} key={activity.id} />
           ));
        } else {
            const l = this.props.activities.length;
            const list = [
                this.props.activities[l-1],
                this.props.activities[l-2],
                this.props.activities[l-3]
            ];
            return (list.map((activity) => (<MyActivity activity={activity} key={activity.id} />)));
        }
    }

    render() {
        return (
            <div className="container-fluid w-100 p-0 ps-md-5 mb-5">
                <h2>Mine aktiviteter</h2>
                <div>
                    {this.renderAllActivities()}
                    {this.props.activities.length === 0 &&
                    <div className={"card"}>
                        <div className={"card-body p-4 d-flex"}>
                            <i className="fas fa-info-circle fa-lg text-muted align-self-center me-4"/>
                            <p className="text-muted fs-6 m-0">Du har ikke opprettet noen aktiviteter enda. <br/>Velg <q>Ny aktivitet</q> i menyen til venstre for å komme i gang.</p>
                        </div>
                    </div>
                    }
                    {this.props.activities.length <= 3 ? null : <Link title="Vis alle" to={`/profile/created`} className={"btn btn-outline-success w-100 mb-4 ps-3 pe-3"}>Vis alle</Link>}
                </div>
            </div>
        );
    }
}
