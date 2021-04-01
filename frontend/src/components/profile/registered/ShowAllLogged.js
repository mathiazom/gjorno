import React from 'react';
import MyRegisteredActivity from './MyRegisteredActivity';
import axios from 'axios';

export default class ShowAllLogged extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
    }

    componentDidMount() {
        axios.get("http://localhost:8000/api/my_registered_activities/",
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

    renderActivities() {
        return (this.state.data.map((activity) => (
            <MyRegisteredActivity data={activity} key={activity.id} />
        )));
    }

    render() {
        return (
            <div className="container-fluid w-75 mt-5">
                <h2>Fullstending logg</h2>
                <div>
                    {this.renderActivities()}
                </div>
            </div>
        );
    }
}
