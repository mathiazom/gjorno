import React from 'react';
import Activity from './Activity';
import axios from 'axios'

export default class Activities extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
        this.getActivities = this.getActivities.bind(this);
    }

    /**
     * Sends a GET to the API, and stores all the activities as a state.
     */
    componentDidMount() {
        this.getActivities();
    }

    /**
     * Sends a GET to the API, and stores all the activities as a state.
     * Used to update an the activity cards after a change.
     */
    getActivities() {
        const headers = {}
        if (this.props.authenticated) {
            headers['Authorization'] = `Token ${window.localStorage.getItem("Token")}`
        }
        axios
            .get(`http://localhost:8000/api/activities/`, {
                headers: headers
            })
            .then(res => {
                this.setState({data: res.data})
            })
            .catch(error => {
                console.log(error.response);
            });
    }

    /**
     * We go through all the activities stored in our state from the API,
     * and we make an Activity with the stored data (from the Activity-component).
     */
    renderAllActivities() {
        return this.state.data.map((activity) => (
            <Activity data={activity} key={activity.id} authenticated={this.props.authenticated} onUpdate={this.getActivities}/>
        ));
    }

    render() {
        return (
            <div className={"mx-auto"}>
                {this.renderAllActivities()}
            </div>
        )
    }
}

