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
                            <p>{props.date}</p>
                            <p>Arrangert av <span className={"text-success"}><b>{props.arrangedBy}</b></span></p>
                        </div>
                        <a href="#" className="btn btn-success float-right">Legg til favoritt</a>
                    </div>
                    <div className={"col-12 d-block d-lg-none pt-3 pb-3"}>
                        <div className={"text-secondary"}>
                            <span>{props.date}</span><br/>
                            <span>Arrangert av <span className={"text-success"}><b>{props.arrangedBy}</b></span></span>
                        </div>
                        <a href="#" className="btn btn-success mt-3">Legg til favoritt</a>
                    </div>
                </div>
        </div>
    );
}

Activity.defaultProps = {
    title: 'Skøyter',
    description: "Jeg tenker å stå på skøyter på Solsiden nå, mens det ennå er is der. Men vil gjerne ikke stå alene, så håper noen vil bli med.",
    date: "11. Februar 2021 - 18:00",
    arrangedBy: "Jenny"
};

export default Activity;
