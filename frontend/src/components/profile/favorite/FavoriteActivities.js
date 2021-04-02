import React from 'react';
import FavoriteActivity from './FavoriteActivity';
import { Link } from 'react-router-dom';

export default class FavoriteActivities extends React.Component {

    /**
     * We go through all the activities stored in our state from the API,
     * and we make a FavoriteActivity with the stored data (from the FavoriteActivity-component).
     */
    renderAllActivities() {
        if (this.props.activities.length <= 3) {
            return this.props.activities.map((activity) => (
                <FavoriteActivity data={activity} key={activity.id} onUpdate={this.props.getFavoriteActivities}/>
           ));
        } else {
            const l = this.props.activities.length;
            const list = [
                this.props.activities[l-1],
                this.props.activities[l-2],
                this.props.activities[l-3]
            ];
            return (list.map((activity) => (<FavoriteActivity data={activity} key={activity.id} onUpdate={this.props.getFavoriteActivities}/>)));
        }
    }

    render() {
        return (
            <div className="container-fluid w-100 p-0 ps-md-5 mb-5">
                <h2>Favoritter</h2>
                <div>
                    {this.renderAllActivities()}
                    {this.props.activities.length > 3 &&
                        <Link title="Vis alle" to={`/profile/favorites`} className={"btn btn-outline-success w-100 mb-4 ps-3 pe-3"} id="show-all-favorites">
                            Vis alle
                        </Link>
                    }
                </div>
            </div>
        );
    }
}
