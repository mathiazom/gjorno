import React from 'react';
import FavoriteActivity from './FavoriteActivity';
import axios from 'axios';
import {updatePageTitle} from "../../common/Utils";

export default class ShowAllFavorites extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
    }

    componentDidMount() {
        updatePageTitle("Mine favoritter");
        axios.get("http://localhost:8000/api/my_favorited_activities/",
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
            <FavoriteActivity data={activity} key={activity.id} />
        )));
    }

    render() {
        return (
            <div className="container-fluid w-75 mt-5">
                <h2>Alle favoritter</h2>
                <div>
                    {this.renderActivities()}
                </div>
            </div>
        );
    }
}
