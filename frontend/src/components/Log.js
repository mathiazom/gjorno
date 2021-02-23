import React from 'react';
import LogActivity from './LogActivity';

const Log = () => {
    return (
        <div className="container-fluid w-100">
            <h2>Aktivitetslogg</h2>
            <div>
                <LogActivity />
                <LogActivity />
                <LogActivity />
                <button className="btn btn-outline-success w-100 mt-4 mb-4 ps-3 pe-3">Vis alle</button>
            </div>
        </div>
    );
}

export default Log;