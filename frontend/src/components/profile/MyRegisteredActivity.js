import React from 'react';
import '@fortawesome/fontawesome-free/js/all.js';

export default class MyActivity extends React.Component {

    /**
     * We take in some props (title and description) to make the Activity.
     * This activity is the one stored on the users profile.
     * 
     * @param {*} props 
     */
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="card w-100 mt-4 mb-4 ps-3 pe-3">
                <div className="card-body d-flex row">
                    <div className={"col pt-2 pb-2"}>
                        <h5 className="card-title text-success"></h5>
                        <p className="card-text"></p>
                    </div>
                </div>
            </div>
        );
    }
}
