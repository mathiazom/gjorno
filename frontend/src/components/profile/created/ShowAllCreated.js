import React from 'react';
import MyActivity from './MyActivity';
import axios from 'axios';
import ActivitiesList from "../ActivitiesList";

/**
 * Page for all activities created by the logged in user
 */
export default class ShowAllCreated extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activities: []
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
                this.setState({activities: res.data});
            })
            .catch(error => {
                console.log(error.response);
        });
    }

    render() {
        return (
            <ActivitiesList
                title={"Mine aktiviteter"}
                activities={this.state.activities}
                renderItem={(activity) => (
                    <MyActivity activity={activity} key={activity.id} />
                )}
            />
        )
    }
}
