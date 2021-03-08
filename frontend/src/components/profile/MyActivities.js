import React from 'react';
import MyActivity from './MyActivity';
import axios from 'axios';

export default class MyActivities extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
    }

    /**
     * Collect the activities posted by the loged in user, and stores them in the current state.
     */
    componentDidMount() {
        axios.get('http://localhost:8000/api/my_activities/',
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
            })
    }

    /**
     * We go through all the activities stored in our state from the API,
     * and we make a MyActivity with the stored data (from the MyActivity-component).
     */
    renderAllActivities() {
        return this.state.data.map((activity) => (
             <MyActivity data={activity} key={activity.id}/>
        ));
    }

    render() {
        return (
            <div className="container-fluid w-100 p-0 ps-md-5">
                <h2>Mine aktiviteter</h2>
                <div>
                    {this.renderAllActivities()}
                    <button className="btn btn-outline-success w-100 mt-4 mb-4 ps-3 pe-3">Vis alle</button>
                </div>
            </div>
        );
    }
}
