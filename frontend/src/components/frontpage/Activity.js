import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {toast} from "react-toastify";
import {OrganizationIcon} from "../activitydetails/OrganizationIcon";
import './Activities.css';

/**
 * Activity card for activities list
 */
export default class Activity extends React.Component {

    /**
     * Sends a POST request to the API, and adds the activity to the
     * currently logged in user's favorites list.
     */
    favorite() {
        axios.post(`http://localhost:8000/api/activities/${this.props.activity.id}/favorite/`,
        null,
        {
            headers: {
                "Authorization": `Token ${window.localStorage.getItem("Token")}`
            }
        }).then(res => {
            if (res.status === 201) {
                toast("Favoritt lagt til 😍", {containerId: 'info-toast-container'});
                // Refresh activity data to see correct favorited icon
                this.props.onUpdate();
            }
            }).catch(error => {
                console.log(error.response);
        })
    }

    /**
     * Sends a POST request to the API to remove the activity
     * from the currently logged in user's favorites list.
     */
    unfavorite() {
        axios.post(`http://localhost:8000/api/activities/${this.props.activity.id}/unfavorite/`,
        null,
        {
            headers: {
                "Authorization": `Token ${window.localStorage.getItem("Token")}`
            }
        }).then(res => {
            if (res.status === 200) {
                toast("Favoritt fjernet 💔️", {containerId: 'info-toast-container'});
                // Refresh activity data to see correct favorited icon
                this.props.onUpdate();
            }
            }).catch(error => {
                console.log(error.response);
        })
    }

    renderCategories() {

        return this.props.categories.map((category) => {
            return (
                <span
                    key={category.id}
                    className="badge bg-success me-1 fw-normal"
                    style={{color: category.text_color}}
                    ref={(el) => el && el.style.setProperty("background-color", category.color, "important")}
                >
                    {category.title}
                </span>
            );
        });

    }

    render() {
        
        return (
            <div className="card activity-card mt-4 mb-4">
                <img src={this.props.activity.image || "images/placeholder.png"} className="img-fluid" alt={"bilde"}/>
                <div className="card-body d-flex row align-items-center">
                    <div className={"col-12 col-xl-8 pe-4"}>
                        <Link to={`/activity/${this.props.activity.id}`} className={"no-decoration"}>
                            <h5 className="card-title text-success">
                                {/* Icon showing what activities have registration */}
                                {this.props.activity.has_registration &&
                                <i className="fas fa-users me-2"> </i>
                                }
                                {this.props.activity.title}
                            </h5>
                        </Link>
                        <p className="card-text mb-2">{this.props.activity.ingress}</p>
                        <div>
                            {this.renderCategories()}
                        </div>
                        <br className={"d-xl-none"} />
                        <span className={"d-xl-none d-flex justify-content-end text-muted fw-light"}><b>- {this.props.activity.username}</b>
                            {/* Verified icon for organizations */}
                            {this.props.activity.is_organization &&
                            <OrganizationIcon />
                            }
                    </span>
                    </div>
                    <div className={"col-12 col-xl-4 text-end d-none d-xl-block pe-5"}>
                        <div className={"text-secondary"}>
                            <span>Publisert av</span><br/>
                            <span className={"text-success d-flex justify-content-end"}><b>{this.props.activity.username} </b>
                                {/* Verified icon for organizations */}
                                {this.props.activity.is_organization &&
                                <OrganizationIcon />
                                }
                        </span>
                        </div>
                        <div className={"mt-3"}>
                            {/* Favorite button, hidden for an unauthorized user */}
                            {(this.props.activity.is_favorited && this.props.authenticated) && <a role="button" title="Fjern fra favoritter" className="text-success" onClick={this.unfavorite}><i className="fas fa-heart fa-lg"/></a>}
                            {(!this.props.activity.is_favorited && this.props.authenticated) && <a role="button" title="Legg til i favoritter" className="text-success" onClick={this.favorite}><i className="far fa-heart fa-lg"/></a>}
                        </div>
                    </div>
                </div>
            </div>
        );

    }

}
