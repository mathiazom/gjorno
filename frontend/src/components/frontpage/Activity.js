import React from 'react';
import { Link } from 'react-router-dom';

/**
 * We take in some props (title, description and username) to make the Activity.
 * 
 * @param {*} props 
 */
const Activity = (props) => {

    return (
        <div className="card activity-card w-75 mx-auto mt-4 mb-4">
            <img src={"images/placeholder.png"} className="img-fluid" alt={"bilde"}/>
            <div className="card-body d-flex row">
                <div className={"col-12 col-lg-8 pe-4"}>
                    <h5 className="card-title text-success">{props.data.title}</h5>
                    <p className="card-text">{props.data.ingress}</p>
                </div>
                <div className={"col-12 col-xl-4 text-end d-none d-xl-block pe-5"}> 
                    <div className={"text-secondary"}>
                        <p>Publisert av <span className={"text-success"}><b>{props.data.username}</b></span></p>
                    </div>
                    <div>
                        <a href="#" className="btn btn-success float-right">Legg til i logg</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Activity;
