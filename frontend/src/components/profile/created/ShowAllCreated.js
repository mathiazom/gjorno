import React from 'react';
import MyActicity from './MyActivity';
import axios from 'axios';

export default class ShowAllCreated extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
    }

    componentDidMount() {
        axios.get("http://localhost:8000/api/my_activities/",
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
            <MyActicity data={activity} key={activity.id} />
        )));
    }

    render() {
        return (
            <div className="container-fluid w-75 mt-5">
                <h2>Alle mine aktiviteter</h2>
                <div>
                    {this.renderActivities()}
                </div>
            </div>
        );
    }
}
