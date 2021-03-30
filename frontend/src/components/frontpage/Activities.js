import React from 'react';
import Activity from './Activity';
import axios from 'axios'
import ActivitiesFilterPanel from "./ActivitiesFilterPanel";
import {filterActivities} from "./FilterUtils";

export default class Activities extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activities: [],
            show_filter_panel: false,
            filters: [],
            filtered_activities: []
        }
        this.getActivities = this.getActivities.bind(this);
        this.onFiltersChanged = this.onFiltersChanged.bind(this);
        this.showFilterPanel = this.showFilterPanel.bind(this);
        this.hideFilterPanel = this.hideFilterPanel.bind(this);
    }

    /**
     * Sends a GET to the API, and stores all the activities as a state.
     */
    componentDidMount() {
        this.getActivities();
    }

    /**
     * Sends a GET to the API, and stores all the activities as a state.
     * Used to update an the activity cards after a change.
     */
    getActivities() {
        const headers = {}
        if (this.props.authenticated) {
            headers['Authorization'] = `Token ${window.localStorage.getItem("Token")}`
        }
        axios
            .get(`http://localhost:8000/api/activities/`, {
                headers: headers
            })
            .then(res => {
                this.setState({
                    activities: res.data,
                    filtered_activities: filterActivities(res.data, this.state.filters)
                });
            })
            .catch(error => {
                console.log(error.response);
            });
    }

    /**
     * Update filters for activity filtering
     */
    onFiltersChanged(filters) {
        this.setState({
            filters: filters,
            filtered_activities: filterActivities(this.state.activities, filters)
        })
    }

    showFilterPanel() {
        this.setState({
            show_filter_panel: true
        });
    }

    hideFilterPanel() {
        this.setState({
            show_filter_panel: false
        });
    }

    /**
     * We go through all the activities stored in our state from the API,
     * and we make an Activity with the stored data (from the Activity-component).
     */
    renderAllActivities() {
        return this.state.filtered_activities.map((activity) => (
            <Activity data={activity} key={activity.id} authenticated={this.props.authenticated}
                      onUpdate={this.getActivities}/>
        ));
    }

    render() {
        return (
            <div>
                <div className={"position-fixed end-0 filter-panel"}
                     style={{display: this.state.show_filter_panel || "none"}}>
                    <ActivitiesFilterPanel
                        activities={this.state.activities}
                        onFiltersChanged={this.onFiltersChanged}
                        onHide={this.hideFilterPanel}
                    />
                </div>
                <div className={"mx-auto activities-list pt-4"}>
                    <div className={"d-flex justify-content-between"}>
                        <span
                            className={"fs-5 align-self-center"}>{this.state.filtered_activities.length} aktiviteter</span>
                        <a role={"button"} className={"btn btn-outline-success align-self-center"}
                           onClick={this.showFilterPanel}>
                            <i className="fas fa-filter me-2"/>Filtrer
                        </a>
                    </div>
                    {this.renderAllActivities()}
                </div>
            </div>
        )
    }
}

