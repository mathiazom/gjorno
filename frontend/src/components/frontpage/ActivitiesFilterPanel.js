import React from 'react';

export default class ActivitiesFilterPanel extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            filters: {}
        }

        this.updateRegistrationFilter = this.updateRegistrationFilter.bind(this);
        this.updateActivityLevelFilter = this.updateActivityLevelFilter.bind(this);
    }

    componentDidMount() {
        // Default to "ANY" for has registration filter
        document.getElementById("registration-filter-any").checked = true;
        // Default to "ANY" for activity level filter
        document.getElementById("activity-level-filter-any").checked = true;
    }

    updateFilter(name, filter) {

        let filters = this.state.filters;

        // Update specified filter
        filters[name] = filter;

        this.setState({
            filters: filters
        })

        this.props.onFiltersChanged(Object.values(this.state.filters));

    }

    updateRegistrationFilter() {

        let filter;

        if (document.getElementById("registration-filter-any").checked) {
            filter = () => true;
        } else if (document.getElementById("registration-filter-yes").checked) {
            filter = (activity) => activity.has_registration
        } else if (document.getElementById("registration-filter-no").checked) {
            filter = (activity) => !activity.has_registration
        }

        this.updateFilter('has_registration', filter);

    }

    updateActivityLevelFilter() {

        let filter;

        if (document.getElementById("activity-level-filter-any").checked) {
            filter = () => true;
        } else if (document.getElementById("activity-level-filter-1").checked) {
            filter = (activity) => activity.activity_level === 1
        } else if (document.getElementById("activity-level-filter-2").checked) {
            filter = (activity) => activity.activity_level === 2
        } else if (document.getElementById("activity-level-filter-3").checked) {
            filter = (activity) => activity.activity_level === 3
        }

        this.updateFilter('activity_level', filter);

    }

    render() {

        return (
            <div className="shadow ps-5 pe-5 pt-4 w-100 bg-white" style={{minHeight: "100%", paddingBottom: "150px"}}>
                <p className={"h4 mt-3"}>Filtrering</p>
                <div className={"mt-4 w-100"}>
                    <div className={"mb-4"}>
                        <label htmlFor="registration-filter-select" className="form-label">Har påmelding</label>
                        <div id="registration-filter-select" className="btn-group d-flex" role="group"
                             aria-label="Basic radio toggle button group">
                            <input type="radio" className="btn-check" name="registration-filter-radio"
                                   id="registration-filter-any"
                                   autoComplete="off" onChange={this.updateRegistrationFilter}/>
                            <label className="btn btn-outline-success" htmlFor="registration-filter-any">Alle</label>

                            <input type="radio" className="btn-check" name="registration-filter-radio"
                                   id="registration-filter-yes"
                                   autoComplete="off" onChange={this.updateRegistrationFilter}/>
                            <label className="btn btn-outline-success" htmlFor="registration-filter-yes">Ja</label>

                            <input type="radio" className="btn-check" name="registration-filter-radio"
                                   id="registration-filter-no"
                                   autoComplete="off" onChange={this.updateRegistrationFilter}/>
                            <label className="btn btn-outline-success" htmlFor="registration-filter-no">Nei</label>
                        </div>
                    </div>
                    <div className={"mb-4"}>
                        <label htmlFor="activity-level-filter-select" className="form-label">Aktivitetsnivå</label>
                        <div id="activity-level-filter-select" className="btn-group d-flex" role="group"
                             aria-label="Basic radio toggle button group">
                            <input type="radio" className="btn-check" name="activity-level-filter-radio"
                                   id="activity-level-filter-any"
                                   autoComplete="off" onChange={this.updateActivityLevelFilter}/>
                            <label className="btn btn-outline-success" htmlFor="activity-level-filter-any">Alle</label>

                            <input type="radio" className="btn-check" name="activity-level-filter-radio"
                                   id="activity-level-filter-1"
                                   autoComplete="off" onChange={this.updateActivityLevelFilter}/>
                            <label className="btn btn-outline-success" htmlFor="activity-level-filter-1">Lett</label>

                            <input type="radio" className="btn-check" name="activity-level-filter-radio"
                                   id="activity-level-filter-2"
                                   autoComplete="off" onChange={this.updateActivityLevelFilter}/>
                            <label className="btn btn-outline-success" htmlFor="activity-level-filter-2">Moderat</label>

                            <input type="radio" className="btn-check" name="activity-level-filter-radio"
                                   id="activity-level-filter-3"
                                   autoComplete="off" onChange={this.updateActivityLevelFilter}/>
                            <label className="btn btn-outline-success"
                                   htmlFor="activity-level-filter-3">Krevende</label>
                        </div>
                    </div>
                </div>
            </div>
        )

    }

}