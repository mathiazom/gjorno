import React from 'react';
import './Activities.css';
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
            filters: [(activity) => (activity.has_registration && (new Date(activity.registration_deadline) - Date.now() > 0)) || (!activity.has_registration)],
            filtered_activities: []
        }
        this.getActivities = this.getActivities.bind(this);
        this.onFiltersChanged = this.onFiltersChanged.bind(this);
        this.toggleFilterPanel = this.toggleFilterPanel.bind(this);
    }

    componentDidMount() {
        this.getActivities();
        this.attachPaneResizeObserver();
    }

    /**
     * Use observer to correctly adjust width of left and right panes
     * when the viewport changes or the right pane is toggled
     */
    attachPaneResizeObserver() {
        const filtersPane = document.getElementById("filters-pane");
        const activitiesPane = document.getElementById("activities-pane");
        const activitiesPaneContainer = document.getElementById("activities-pane-container");
        const resObs = new ResizeObserver(() => {
            activitiesPane.style.width = (activitiesPaneContainer.clientWidth - filtersPane.clientWidth) + "px";
        });
        resObs.observe(activitiesPaneContainer);
        resObs.observe(filtersPane);
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
        console.log(this.state.filters)
        this.setState({
            filters: filters,
            filtered_activities: filterActivities(this.state.activities, filters)
        })
    }

    /**
     * Toggle width of filters pane to either show or hide it
     */
    toggleFilterPanel() {
        const filtersPane = document.getElementById("filters-pane");
        const filterButtonIcon = document.getElementById("filter-button-icon");
        if (this.state.show_filter_panel) {
            filtersPane.classList.remove("d-md-block");
            filterButtonIcon.classList.remove("fa-times");
            filterButtonIcon.classList.add("fa-filter");
        } else {
            filtersPane.classList.add("d-md-block");
            filterButtonIcon.classList.remove("fa-filter");
            filterButtonIcon.classList.add("fa-times");
        }
        this.setState({
            show_filter_panel: !this.state.show_filter_panel
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
            <div id={"activities-pane-container"} className={"d-flex flex-column"}>
                <div id={"activities-pane"}>
                    <div className={"mx-auto activities-list pt-4 ps-5 pe-5"}>
                        <div className={"d-flex justify-content-between"}>
                            <span className={"fs-5 align-self-center"}>{this.state.filtered_activities.length} aktiviteter</span>
                            <a role={"button"} className={"d-none d-md-block btn btn-outline-success align-self-center"}
                               onClick={this.toggleFilterPanel}>
                                <i id={"filter-button-icon"} className={"fas me-2 fa-filter"}/>
                                Filter
                            </a>
                        </div>
                        {this.renderAllActivities()}
                    </div>
                </div>
                <div id={"filters-pane"} className={"right-toggle-pane d-none ps-4"}>
                    <ActivitiesFilterPanel
                        activities={this.state.activities}
                        onFiltersChanged={this.onFiltersChanged}
                    />
                </div>
            </div>
        );
    }
}

