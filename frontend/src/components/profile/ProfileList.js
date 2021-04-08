import React from 'react';
import { Link } from 'react-router-dom';

export default class ProfileList extends React.Component {

    /**
     * We go through all the activities stored in our state from the API,
     * and we make a MyActivity with the stored data (from the MyActivity-component).
     */
    renderAllActivities() {
        return this.props.activities
            .slice(0,3)
            .map(this.props.renderItem);
    }

    render() {
        return (
            <div className="container-fluid w-100 p-0 ps-md-5 mb-5">
                <h2>{this.props.title}</h2>
                <div>
                    {this.renderAllActivities()}
                    {this.props.activities.length === 0 &&
                    <div className={"card"}>
                        <div className={"card-body p-4 d-flex"}>
                            <i className="fas fa-info-circle fa-lg text-muted align-self-center me-4"/>
                            <p className="text-muted fs-6 m-0">{this.props.emptyMessage}</p>
                        </div>
                    </div>
                    }
                    {this.props.activities.length <= 3 ? null : <Link title="Vis alle" to={this.props.showAllPath} className={"btn btn-outline-success w-100 mb-4 ps-3 pe-3"}>Vis alle</Link>}
                </div>
            </div>
        );
    }
}
