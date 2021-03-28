import React from 'react';
import axios from 'axios';
import FavoriteActivity from './FavoriteActivity';

export default class FavoriteActivites extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
        this.getFavoriteActivities = this.getFavoriteActivities.bind(this);
    }

    /**
     * Collect the activities posted by the logged in user, and stores them in the current state.
     */
    componentDidMount() {
        axios.get('http://localhost:8000/api/my_favorited_activities/',
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

    getFavoriteActivities() {
        axios.get('http://localhost:8000/api/my_favorited_activities/',
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
     * and we make a SavedActiviy with the stored data (from the SavedActiviy-component).
     */
    renderAllActivities() {
        if (this.state.data.length <= 3) {
            return this.state.data.map((activity) => (
                <FavoriteActivity data={activity} key={activity.id} onUpdate={this.getFavoriteActivities}/>

           ));
        } else {
            const l = this.state.data.length;
            const list = [
                this.state.data[l-1],
                this.state.data[l-2],
                this.state.data[l-3]
            ];
            return (list.map((activity) => (<FavoriteActivity data={activity} key={activity.id} onUpdate={this.getFavoriteActivities}/>)));
        }
    }

    render() {
        return (
            <div className="container-fluid w-100 p-0 ps-md-5">
                <h2>Favoritt aktiviteter</h2>
                <div>
                    {this.renderAllActivities()}
                    <button className="btn btn-outline-success w-100 mb-4 ps-3 pe-3">Vis alle</button>
                </div>
            </div>
        );
    }
}
