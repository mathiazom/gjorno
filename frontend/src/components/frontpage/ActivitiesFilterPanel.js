import React from 'react';

export default class ActivitiesFilterPanel extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            filters: {}
        }

        this.updateRegistrationFilter = this.updateRegistrationFilter.bind(this);
        this.updateActivityLevelFilter = this.updateActivityLevelFilter.bind(this);
        this.updateExpiredRegistrationFilter = this.updateExpiredRegistrationFilter.bind(this);
        this.updateCapacityFilter = this.updateCapacityFilter.bind(this);
        this.updatePriceFilter = this.updatePriceFilter.bind(this);
    }

    componentDidMount() {
        // Default to "ANY" for has registration filter
        document.getElementById("registration-filter-any").checked = true;
        this.updateRegistrationFilter();
        // Default to "ANY" for activity level filter
        document.getElementById("activity-level-filter-any").checked = true;
        this.updateActivityLevelFilter();
        // Default to "No" for expired registrations filter
        document.getElementById("expired-registration-filter-no").checked = true;
        this.updateExpiredRegistrationFilter();
        // Default to 0 for registration capacity
        document.getElementById("capacity-range").value = 0;

        document.getElementById("price-filter").value;
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

    updateExpiredRegistrationFilter() {

        let filter;

        if (document.getElementById("expired-registration-filter-yes").checked) {
            filter = () => true;
        } else if (document.getElementById("expired-registration-filter-no").checked) {
            filter = (activity) => (activity.has_registration && (new Date(activity.registration_deadline) - Date.now() > 0)) || (!activity.has_registration)
        }

        this.updateFilter("expired_registration", filter);
    }
    
    updateCapacityFilter() {
        
        let filter;
        const min = document.getElementById("capacity-range").value;
        document.getElementById("chosen-capacity").innerHTML = min;

        if (min == 0) {
            filter = () => true;
        } else if (min > 0) {
            filter = (activity) => (activity.has_registration && activity.registration_capacity - activity.registrations_count >= min) || (!activity.has_registration)
        }
    updatePriceFilter() {
        let filter;
        filter = (activity) => activity.price <= document.getElementById("price-filter").value;
        this.updateFilter('price', filter);
    }

    render() {

        this.updateFilter("registration_capacity", filter);
    }

    render() {
        
        const maxCapacity = Math.max(...this.props.activities.filter((activity) => activity.has_registration).map((activity) => (activity.registration_capacity - activity.registrations_count)));
        
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
                    <div className={"mb-4"}>
                        <label htmlFor="expired-registration-filter-select" className="form-label">Vis utløpte aktiviteter</label>
                        <div id="expired-registration-filter-select" className="btn-group d-flex" role="group"
                             aria-label="Basic radio toggle button group">
                            <input type="radio" className="btn-check" name="expired-registration-filter-radio"
                                   id="expired-registration-filter-yes"
                                   autoComplete="off" onChange={this.updateExpiredRegistrationFilter}/>
                            <label className="btn btn-outline-success" htmlFor="expired-registration-filter-yes">Ja</label>

                            <input type="radio" className="btn-check" name="expired-registration-filter-radio"
                                   id="expired-registration-filter-no"
                                   autoComplete="off" onChange={this.updateExpiredRegistrationFilter}/>
                            <label className="btn btn-outline-success" htmlFor="expired-registration-filter-no">Nei</label>
                        </div>
                    </div>
                    <div className={"mb-4"}>
                        <label htmlFor="capacity-range" className="form-label">Mininum ledige plasser: <span id="chosen-capacity">0</span></label>
                       <input type="range" className="form-range" min="0" max={(maxCapacity < 50) ? maxCapacity : 50} id="capacity-range" onChange={this.updateCapacityFilter}></input>
                    </div>
                        <label htmlFor="activity-level-filter-select" className="form-label">Pris</label>
                        <div className="range">
                            <input 
                            name="price-filter-name" 
                            type="range" 
                            className="form-range" 
                            min="0" max={this.props.maxPrice} 
                            defaultValue={this.props.maxPrice} 
                            id="price-filter" 
                            onChange={() => {
                                document.getElementById("price-filter-value").innerText = document.getElementById("price-filter").value;
                                this.updatePriceFilter();
                            }} />
                            <span id="price-filter-value">{this.props.maxPrice}</span>
                            <span> kroner</span>
                        </div>
                    </div>
                </div>
            </div>
        )

    }

}