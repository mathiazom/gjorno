import React from 'react';
import {withRouter} from 'react-router-dom';
import axios from "axios";
import MultiSelect from "react-multi-select-component";
import DateTimePicker from "../common/DateTimePicker"

class CreateActivity extends React.Component {

    constructor(props) {
        super(props);
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        this.state = {
            categories: [],
            selected_categories: [],
            deadline_datetime: null,
            start_datetime: null
        };
        // Bind "this" to get access to "this.props.history"
        this.createActivity = this.createActivity.bind(this);
    }

    /**
     * Retrieve all available categories
     */
    componentDidMount() {

        axios.get('http://localhost:8000/api/categories/')
            .then(res => {
                // Create category dropdown options
                let categories = res.data.map((category)=>{
                    return {label: category.title, value: category.id}
                });
                this.setState({categories: categories});
            })
            .catch(error => {
                console.log(error.response);
            })
    }

    /**
     * Function for creating a new activity.
     * Takes values from html-form and sends a POST to the API
     */
    createActivity() {
        const registration = document.getElementById("registration-checkbox").checked ? true : false;
        // Extract ids of selected categories
        const category_ids = this.state.selected_categories.map((category) => {
            return category.value;
        })
        if (registration) {
            axios.post("http://localhost:8000/api/activities/",
            {
                title: document.getElementById("activity-title-input").value,
                ingress: document.getElementById("activity-ingress-input").value,
                description: document.getElementById("activity-description-input").value,
                categories: category_ids,
                has_registration: true,
                registration_capacity: document.getElementById("registration-capacity-input").value,
                registration_deadline: this.state.deadline_datetime.toISOString(),
                starting_time: this.state.start_datetime.toISOString(),
                location: document.getElementById("activity-location-input").value
            },
            {
                headers: {
                    "Authorization": `Token ${window.localStorage.getItem("Token")}`
                }})
            .then(() => {
                this.props.history.push("/");
            }).catch(error => {
                console.log(error.response);
            });
        } else {
            axios.post("http://localhost:8000/api/activities/",
            {
                title: document.getElementById("activity-title-input").value,
                ingress: document.getElementById("activity-ingress-input").value,
                description: document.getElementById("activity-description-input").value,
                categories: category_ids
            },
            {
                headers: {
                    "Authorization": `Token ${window.localStorage.getItem("Token")}`
                }})
            .then(() => {
                this.props.history.push("/");
            }).catch(error => {
                console.log(error.response);
            });
        }
    }

    /**
     * Checks whether or not the registration checkbox is checked.
     * Then we display the rest of the form.
     */
    displayRegistrationForm() {
        const elements = ["registration-capacity", "registration-deadline", "starting_time", "location"];
        if (document.getElementById("registration-checkbox").checked) {
            elements.forEach(item => document.getElementById(item).style.display = "block");
        } else {
            elements.forEach(item => document.getElementById(item).style.display = "none");
        }
    }

    render() {

        return(
            <div className="container-fluid w-50 m-5 mx-auto">
                <h1>Ny aktivitet</h1>
                <div className="row" id="activity-form">
                    {/*Title */}
                    <div className="mt-3 mb-3">
                        <label htmlFor="activity-title-input" className="form-label">Tittel</label>
                        <input id="activity-title-input" type="text" className="form-control"
                               placeholder="Joggetur" required/>
                    </div>
                    {/*Ingress */}
                    <div className="mb-3">
                        <label htmlFor="activity-ingress-input" className="form-label">Ingress</label>
                        <input className="form-control" id="activity-ingress-input" type="text" required
                        placeholder={"Joggetur fra Gløshaugen til Heimdal."}/>
                    </div>
                    {/*Description */}
                    <div className="mb-3">
                        <label htmlFor="activity-ingress-input" className="form-label">Ingress</label>
                        <textarea className="form-control" id="activity-ingress-input" rows="2" required
                                  placeholder={"Fin joggetur på 8km med flatt terreng."}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="activity-description-input" className="form-label">Beskrivelse</label>
                        <textarea className="form-control" id="activity-description-input" rows="3" required
                        placeholder={"Solid joggetur på 8 km. Terrenget er nokså flatt. Anbefaler å ligge på rundt 7 km/t."}/>
                    </div>
                    {/*Categories */}
                    <div className="mb-3">
                        <label htmlFor="activity-categories-input" className="form-label">Kategorier</label>
                        <MultiSelect
                            id="activity-categories-input"
                            options={this.state.categories}
                            value={this.state.selected_categories}
                            onChange={(selected)=>this.setState({selected_categories: selected})}
                            hasSelectAll={false}
                            focusSearchOnOpen={false}
                            overrideStrings={{
                                "selectSomeItems": "Velg",
                                "allItemsAreSelected": "Alle kategorier",
                                "search": "Søk"
                            }}
                        />
                    </div>
                    {/*Registration checkbox */}
                    <div className={"mt-2"}>
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" onClick={this.displayRegistrationForm} id="registration-checkbox"/>
                            <label className="form-check-label" htmlFor="registration-checkbox">Registrering</label>
                        </div>
                    </div>
                    {/*Capacity */}
                    <div id="registration-capacity" style={{display:"none"}} className="mb-3">
                        <br/>
                        <label className="form-label">Antall plasser</label>
                        <input type="number" min={1} className="form-control" id="registration-capacity-input" required/>
                    </div>
                    {/*Reg deadline date */}
                    <div id="registration-deadline" style={{display:"none"}} className="mb-3">
                        <label htmlFor="start-date" className="form-label">Påmeldingsfrist</label>
                        <br/>
                        <DateTimePicker
                            selected={this.state.deadline_datetime}
                            onChange={date => this.setState({deadline_datetime:date})}
                        />
                    </div>
                    {/*Date */}
                    <div id="starting_time" style={{display:"none"}} className="mb-3">
                        <label htmlFor="start-date" className="form-label">Starttidspunkt</label>
                        <br/>
                        <DateTimePicker
                            selected={this.state.start_datetime}
                            onChange={date => this.setState({start_datetime:date})}
                        />
                    </div>
                    {/*Location */}
                    <div id="location" style={{display:"none"}} className="mb-3">
                        <label htmlFor="activity-location" className="form-label">Sted</label>
                        <input id="activity-location-input" type="text" className="form-control"
                               placeholder="Gløshaugen" required/>
                    </div>
                </div>
                <div className="mt-5 row">
                    <div className={"d-none d-md-block col-4 pe-4"}>
                        <button className="btn btn-outline-secondary w-100" onClick={this.props.history.goBack}>Avbryt</button>
                    </div>
                    <div className={"col"}>
                        <button className="btn btn-success w-100" onClick={this.createActivity}>Legg ut</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(CreateActivity);
