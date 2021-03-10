import React from 'react';
import Activity from './Activity';
import axios from 'axios'

export default class Activities extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
    }

    /**
     * Sends a GET to the API, and stores all the activities as a state.
     */
    componentDidMount() {
        axios.get('/api/activities/')
            .then(res => {
                this.setState({data: res.data});
            }).catch(error => {
                console.log(error.response);
            });
    }

    /**
     * We go through all the activities stored in our state from the API,
     * and we make a Activity with the stored data (from the Activity-component).
     */
    renderAllActivities() {
        return this.state.data.map((activity) => (
            <Activity data={activity} key={activity.id}/>
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
