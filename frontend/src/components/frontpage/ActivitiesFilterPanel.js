import React from 'react';

const FILTER_ANY = "0";

export default class ActivitiesFilterPanel extends React.Component {

    constructor(props) {
        super(props);

        this.updateFilters = this.updateFilters.bind(this);
    }

    updateFilters() {

        const filters = [];

        const hasRegistrationValue = document.getElementById("registration-filter-select").value;
        if (hasRegistrationValue !== FILTER_ANY) {
            filters.push((activity) => {
                return activity.has_registration === (hasRegistrationValue === "1")
            })
        }

        const activityLevelValue = document.getElementById("activity-level-filter-select").value;
        if (activityLevelValue !== FILTER_ANY) {
            filters.push((activity) => {
                return activity.activity_level != null && activity.activity_level.toString() === activityLevelValue
            })
        }

        this.props.onFiltersChanged(filters);

    }

    render() {

        return (
            <div className="shadow ps-5 pe-5 pt-4 bg-white vh-100 ">
                <a role={"button"} onClick={this.props.onHide}><span className="fa-times-thin fa-2x"/></a>
                <p className={"h4 mt-3"}>Filtrering</p>
                <div className={"mt-4"}>
                    <div className={"mb-3"}>
                        <label htmlFor="registration-filter-select" className="form-label">Har påmelding</label>
                        <select id="registration-filter-select" className="form-select" onChange={this.updateFilters}
                                defaultValue={FILTER_ANY}>
                            <option value={FILTER_ANY}>Alle</option>
                            <option value={"1"}>Ja</option>
                            <option value={"2"}>Nei</option>
                        </select>
                    </div>
                    <div className={"mb-3"}>
                        <label htmlFor="activity-level-filter-select" className="form-label">Aktivitetsnivå</label>
                        <select id="activity-level-filter-select" className="form-select" onChange={this.updateFilters}
                                defaultValue={FILTER_ANY}>
                            <option value={FILTER_ANY}>Alle</option>
                            <option value={"1"}>Lett</option>
                            <option value={"2"}>Moderat</option>
                            <option value={"3"}>Krevende</option>
                        </select>
                    </div>
                </div>
            </div>
        )

    }

}