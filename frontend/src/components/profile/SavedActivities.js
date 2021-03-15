import React from 'react';
//import axios from 'axios';
import SavedActivity from './SavedActivity';

export default class SavedActivities extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
    }

    /**
     * Collect the activities posted by the logged in user, and stores them in the current state.
     */
    componentDidMount() {
        /*axios.get('http://localhost:8000/api/my_saved/',
            {
                headers: {
                    "Authorization": `Token ${window.localStorage.getItem("Token")}`
                }
            })
            .then(res => {
                this.setState({data: res.data});
            })
            .catch(error => {
                console.log(error.response);
            })*/
    }

    /**
     * We go through all the activities stored in our state from the API,
     * and we make a SavedActiviy with the stored data (from the SavedActiviy-component).
     */
    renderAllActivities() {
        if (this.state.data.length <= 3) {
            return this.state.data.map((activity) => (
                <SavedActivity data={activity} key={activity.id} />
           ));
        } else {
            const l = this.state.data.length;
            const list = [
                this.state.data[l-1],
                this.state.data[l-2],
                this.state.data[l-3]
            ];
            return (list.map((activity) => (<SavedActivity data={activity} key={activity.id} />)));
        }
    }

    render() {
        return (
            <div className="container-fluid w-100 p-0 ps-md-5">
                <h2>Lagrede aktiviteter</h2>
                <div>
                    {this.renderAllActivities()}
                    <button className="btn btn-outline-success w-100 mt-4 mb-4 ps-3 pe-3">Vis alle</button>
                </div>
            </div>
        );
    }
}
