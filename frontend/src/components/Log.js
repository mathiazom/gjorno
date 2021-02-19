import React from 'react';
import LogActivity from './LogActivity';

const Log = () => {
    return (
        <div>
            <div>
                <LogActivity />
                <LogActivity />
                <LogActivity />
            </div>
            <button>Vis alle</button>
        </div>

    );
}

export default Log;