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
     * 
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
                console.log(this.state.data[this.state.data.length-2]);
            })
            .catch(error => {
                console.log(error.response);
            })
    }

    /**
     * 
     * @returns 
     */
    renderAllActivities() {
        if (this.state.data.length <= 3) {
            return this.state.data.map((activity) => (
                <MyRegisteredActivity data={activity} key={activity.id} />
           ));
        } else {
            const l = this.state.data.length;
            const list = [
                this.state.data[l-1],
                this.state.data[l-2],
                this.state.data[l-3]
            ];
            return (list.map((activity) => (<MyRegisteredActivity data={activity} key={activity.id} />)));
        }
    }

    render() {
        return (
            <div className="container-fluid w-100 p-0 ps-md-5">
                <h2>Aktivitetslogg</h2>
                <div>
                    {this.renderAllActivities()}
                    <button className="btn btn-outline-success w-100 mt-4 mb-4 ps-3 pe-3">Vis alle</button>
                </div>
            </div>
        );
    }
}
