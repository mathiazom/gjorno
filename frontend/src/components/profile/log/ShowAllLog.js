import React from 'react';
import MyLogActivity from './MyLogActivity';
import axios from 'axios';
import {compareActivityDates} from "../../common/Utils";
import ShowAll from "../ShowAll";

export default class ShowAllLog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activities: []
        }
    }

    /**
     * Get all the registered and logged activities for the user.
     */
    componentDidMount() {
        this.getLogActivities();
    }


    /**
     * Sends an API GET request to get the activities which the user has logged,
     * as well as activities where user is registered
     */
    getLogActivities() {
        axios.get('http://localhost:8000/api/my_logs/',
            {
                headers: {
                    "Authorization": `Token ${window.localStorage.getItem("Token")}`
                }
            })
            .then(logged_res => {
                axios.get('http://localhost:8000/api/my_registered_activities/',
                    {
                        headers: {
                            "Authorization": `Token ${window.localStorage.getItem("Token")}`
                        }
                    })
                    .then(registered_res => {
                        this.setState({
                            log_activities: logged_res.data
                                .concat(registered_res.data)
                                .sort(compareActivityDates)
                                .reverse()
                        });
                    })
                    .catch(error => {
                        console.log(error.response);
                    });
            })
            .catch(error => {
                console.log(error.response);
            });
    }

    render() {
        return (
            <ShowAll
                title={"Fullstendig log"}
                activities={this.state.activities}
                renderItem={(logged_activity) => (
                    <MyLogActivity logged_activity={logged_activity} key={logged_activity.log_id}/>
                )}
            />
        )
    }
}
