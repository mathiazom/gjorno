import React from 'react';

const Activity = () => {
    return (
        <div className="activity">
            <div class="activity-left-section">
                <h1 className="activity_main_header">Løpetur</h1>
                <img className="activity_img" src="images/runner.png" alt={"runner"}/>
            </div>
            <p className="activity_paragraph">Løpetur fra Gløshaugen til Heimdal. Det er bare å blir med! Tenker å ligge på cirka 7km/t.</p>
            <div class="activity-right-section">
                <h5 className="activity_date">11. Februar 2021 - 18:00</h5>
                <h5 className="activity_organizer">Arrangert av Eksem Pel</h5>
                <button className="activity_join_button">BLI MED</button>
            </div>
        </div>
    );
}

export default Activity;