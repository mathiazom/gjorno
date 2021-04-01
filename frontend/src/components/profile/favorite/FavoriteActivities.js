import React from 'react';
import axios from 'axios';
import FavoriteActivity from './FavoriteActivity';
import { Link } from 'react-router-dom';

export default class FavoriteActivites extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
        this.getFavoriteActivities = this.getFavoriteActivities.bind(this);
    }

    /**
     * Collects the activities favorited by the logged in user, and stores them in the current state.
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

    /**
     * Collects the activities favorited by the logged in user, and stores them in the current state.
     * Used for updating the favorites list after a change.
     */
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
     * and we make a FavoriteActivity with the stored data (from the FavoriteActivity-component).
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
                <h2>Favoritter</h2>
                <div>
                    {this.renderAllActivities()}
                    <Link title="Vis alle" to={`/profile/favorites`} className={"btn btn-outline-success w-100 mb-4 ps-3 pe-3"}>Vis alle</Link>
                </div>
            </div>
        );
    }
}
