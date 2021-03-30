import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {toast} from "react-toastify";

/**
 * We take in some props (title, description and username) to make the Activity.
 *
 * @param {*} props
 */
const Activity = (props) => {

    /**
     * Sends a POST request to the API, and adds the activity to the
     * currently logged in user's favorites list.
     */
    const favorite = () => {
        axios.post(`http://localhost:8000/api/activities/${props.data.id}/favorite/`,
        null,
        {
            headers: {
                "Authorization": `Token ${window.localStorage.getItem("Token")}`
            }
        }).then(res => {
            console.log(res.status)
            if (res.status === 201) {
                toast("Favoritt lagt til 😍", {containerId: 'info-toast-container'});
                // Refresh activity data to see correct favorite icon
                props.onUpdate();
            }
            }).catch(error => {
                console.log(error.response);
        })
    }

    /**
     * Sends a POST request to the API to remove the activity
     * from the currently logged in user's favorites list.
     */
    const unfavorite = () => {
        axios.post(`http://localhost:8000/api/activities/${props.data.id}/unfavorite/`,
        null,
        {
            headers: {
                "Authorization": `Token ${window.localStorage.getItem("Token")}`
            }
        }).then(res => {
            console.log(res.status)
            if (res.status === 200) {
                toast("Favoritt fjernet 💔️", {containerId: 'info-toast-container'});
                // Refresh activity data to see correct favorite icon
                props.onUpdate();
            }
            }).catch(error => {
                console.log(error.response);
        })
    }

    return (
        <div className="card activity-card w-75 mx-auto mt-4 mb-4">
            <img src={props.data.image || "images/placeholder.png"} className="img-fluid" alt={"bilde"}/>
            <div className="card-body d-flex row align-items-center">
                <div className={"col-12 col-lg-8 pe-4"}>
                <Link to={`/activity-details/${props.data.id}`} style={{textDecoration: "none"}}>
                <h5 className="card-title text-success">
                    {/* Icon showing what activities have registration */}
                    {props.data.has_registration &&
                        <i className="fas fa-users me-2"> </i>
                    }
                    {props.data.title}
                </h5></Link>
                    <p className="card-text">{props.data.ingress}</p>
                </div>
                <div className={"col-12 col-xl-4 text-end d-none d-xl-block pe-5"}>
                    <div className={"text-secondary"}>
                        <span>Publisert av</span><br/>
                        <span className={"text-success"}><b>{props.data.username} </b>
                        {/* Verified icon for organizations */}
                            {props.data.is_organization &&
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-patch-check-fill text-primary" viewBox="0 0 16 16">
                                    <path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01-.622-.636zm.287 5.984l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708.708z"/>
                                </svg>
                            }
                        </span>
                    </div>
                    <div className={"mt-3"}>
                        {/* Favorite button, hidden for an unauthorized user */}
                        {(props.data.is_favorited && props.authenticated) && <a role="button" title="Fjern fra favoritter" className="text-success" onClick={unfavorite}><i className="fas fa-heart fa-lg"/></a>}
                        {(!props.data.is_favorited && props.authenticated) && <a role="button" title="Legg til i favoritter" className="text-success" onClick={favorite}><i className="far fa-heart fa-lg"/></a>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Activity;
