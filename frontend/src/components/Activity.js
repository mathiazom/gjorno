import React from 'react';

const Activity = (props) => {

    return (
        <div className="card activity-card w-75 mx-auto mt-4 mb-4">
            <img src={"images/placeholder.png"} className="img-fluid" alt={"bilde"}/>
            <div className="card-body d-flex row">
                <div className={"col-12 col-lg-8 pe-4"}>
                    <h5 className="card-title text-success">{props.data.title}</h5>
                    <p className="card-text">{props.data.description}</p>
                </div>
                <div className={"col-12 col-xl-4 text-end d-none d-xl-block pe-5"}>
                    <div className={"text-secondary"}>
                        <p>Publisert av <span className={"text-success"}><b>{props.data.username}</b></span></p>
                    </div>
                    <a href="#" className="btn btn-success float-right">Legg til i logg</a>
                </div>
                <div className={"col-12 d-block d-xl-none pt-3 pb-3"}>
                    <div className={"text-secondary"}>
                        <span>Publisert av <span className={"text-success"}><b>{props.data.username}</b></span></span>
                    </div>
                    <a href="#" className="btn btn-success mt-3">Legg til i logg</a>
                </div>
            </div>
        </div>
    );
}

export default Activity;
