import React from 'react';
import MyActivity from './MyActivity';
import axios from 'axios';
import ShowAll from "../ShowAll";

export default class ShowAllCreated extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activities: []
        }
    }

    componentDidMount() {
        axios.get("https://api.gjorno.site/api/my_activities/",
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
            <ShowAll
                title={"Mine aktiviteter"}
                activities={this.state.activities}
                renderItem={(activity) => (
                    <MyActivity activity={activity} key={activity.id} />
                )}
            />
        )
    }
}
