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

    componentDidMount() {
        axios.get('/api/activities/')
            .then(res => {
                this.setState({data: res.data});
                console.log(res.data);
            });
    }
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

