import React from 'react';

const Activity = (props) => {

    return (
        <div className="card activity-card w-75 mx-auto mt-4 mb-4 ps-3 pe-3">
            <img src={"images/runner.png"} className="img-fluid ps-4 pe-4" alt={"runner"}/>
                <div className="card-body d-flex row">
                    <div className={"col-12 col-lg-8 pe-4"}>
                        <h5 className="card-title text-success">{props.data.title}</h5>
                        <p className="card-text">{props.data.description}</p>
                    </div>
                    <div className={"col-12 col-lg-4 text-end d-none d-lg-block"}>
                        <div className={"text-secondary"}>
                            <p>Publisert av <span className={"text-success"}><b>{props.data.username}</b></span></p>
                        </div>
                        <a href="#" className="btn btn-success float-right">Legg til i logg</a>
                    </div>
                    <div className={"col-12 d-block d-lg-none pt-3 pb-3"}>
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
