import React from 'react';
import MyRegisteredActivity from './MyRegisteredActivity';
import axios from 'axios';

export default class MyActivities extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
    }

    /**
     * Get all the activities registered to the user.
     */
    componentDidMount() {
        axios.get('/api/my_registered_activities/',
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
        });
    }

    /**
     * We only render 3 activities. If there are more we take the last three.
     */
    renderAllActivities() {
        if (this.state.data.length <= 3) {
            return this.state.data.map((activity) => (
                activity.username == this.props.username ? null : <MyRegisteredActivity data={activity} key={activity.id} />
           ));
        } else {
            const l = this.state.data.length;
            const list = [
                this.state.data[l-1],
                this.state.data[l-2],
                this.state.data[l-3]
            ];
            return (list.map((activity) => (
                activity.username == this.props.username ? null : <MyRegisteredActivity data={activity} key={activity.id} />
            )));
        }
    }

    render() {
        return (
            <div className="container-fluid w-100 p-0 ps-md-5">
                <h2>Påmedlte aktiviteter</h2>
                <div>
                    {this.renderAllActivities()}
                    <button className="btn btn-outline-success w-100 mb-4 ps-3 pe-3">Vis alle</button>
                </div>
            </div>
        );
    }
}
