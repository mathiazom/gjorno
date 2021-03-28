import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/js/all.js';

export default class FavoriteActivity extends React.Component {

    /**
     * We take in some props (title and description) to make the Activity.
     * This activity is the one stored on the users profile.
     * 
     * @param {*} props 
     */
    constructor(props) {
        super(props);
        this.unfavorite = this.unfavorite.bind(this);
    }


    unfavorite() {
        axios.post(`http://localhost:8000/api/activities/${this.props.data.id}/unfavorite/`,
        {
            activity: this.props.data.id,
        },
        {
            headers: {
                "Authorization": `Token ${window.localStorage.getItem("Token")}`
            }
        }).then(res => {
            console.log(res.status)
            if (res.status === 200) {
                // Refresh activity data to see correct favorite icon
                this.props.onUpdate();
            }
            }).catch(error => {
                console.log(error.response);
        })
    }

    render() {
        return (
            <div className="card w-100 mt-4 mb-4 ps-3 pe-3">
                <div className="card-body d-flex row">
                    <div className={"col pt-2 pb-2"}>
                        <Link to={`/activity-details/${this.props.data.id}`} style={{textDecoration: "none"}}>
                        <h5 className="card-title text-success">{this.props.data.title}</h5></Link>
                        <p className="card-text">{this.props.data.description}</p>
                    </div>
                    <div className={"col-2 d-none d-md-flex justify-content-end align-items-center"}>
                    {/*Unfavorite/delete button? Or just show regular Activity?*/}
                        <button className="btn btn-link" onClick={this.unfavorite}><i className="fas fa-trash"></i></button>
                    </div>
                </div>
            </div>
        );
    }
}
