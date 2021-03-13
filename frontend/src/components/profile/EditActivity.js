import React from 'react';
import {withRouter} from 'react-router-dom';
import axios from "axios";
import MultiSelect from "react-multi-select-component";

class EditActivity extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            selected_categories: []
        };
        // Bind "this" to get access to "this.props.history"
        this.editActivity = this.editActivity.bind(this);
    }

    /**
     * Collect all different categories on the server.
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
        this.fillActivity();
    }

    /**
     * Collect the activity to be edited. Provides a number (1,2,3...) as ID.
     * Set the fields in the form to equal the collected data.
     */
    fillActivity() {
        axios.get(`http://localhost:8000/api/activities/${this.props.match.params.id}`)
            .then(res => {
                const activity = res.data;
                document.getElementById("activity-title-input").value = activity.title;
                document.getElementById("activity-ingress-input").value = activity.ingress;
                document.getElementById("activity-description-input").value = activity.description;
                const elements = ["registration-capacity", "registration-deadline", "starting_time", "location"];
                if (activity.has_registration == true) {
                    elements.forEach(item => document.getElementById(item).style.display = "block");
                    document.getElementById("registration-checkbox").checked = true;
                    document.getElementById("registration-capacity-input").value = activity.registration_capacity;
                    // slice to remove the Z at the end of the date-string
                    document.getElementById("reg-deadline").value = activity.registration_deadline.slice(0, -1);
                    document.getElementById("start-date").value = activity.starting_time.slice(0, -1);
                    document.getElementById("activity-location-input").value = activity.location;
                } else {
                    elements.forEach(item => document.getElementById(item).style.display = "none");
                }
                const selected = []
                for (const category of this.state.categories){
                    if(activity.categories.indexOf(category.value) !== -1){
                        selected.push(category)
                    }
                }
                this.setState({selected_categories: selected})
            })
            .catch(error => {
                console.log(error.response);
            });
    }

    /**
     * Send the edited activity back to the server, using a PUT.
     */
    editActivity() {
        const registration = document.getElementById("registration-checkbox").checked ? true : false;
        // Extract ids of selected categories
        const category_ids = this.state.selected_categories.map((category)=>{
            return category.value;
        });
        if (registration) {
            axios.put(`http://localhost:8000/api/activities/${this.props.match.params.id}/`,
            {
                title: document.getElementById("activity-title-input").value,
                ingress: document.getElementById("activity-ingress-input").value,
                description: document.getElementById("activity-description-input").value,
                categories: category_ids,
                has_registration: true,
                registration_capacity: document.getElementById("registration-capacity-input").value,
                registration_deadline: document.getElementById("reg-deadline").value,
                starting_time: document.getElementById("start-date").value,
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
            axios.put(`http://localhost:8000/api/activities/${this.props.match.params.id}/`,
            {
                title: document.getElementById("activity-title-input").value,
                ingress: document.getElementById("activity-ingress-input").value,
                description: document.getElementById("activity-title-input").value,
                categories: category_ids
            },
            {
                headers: {
                    "Authorization": `Token ${window.localStorage.getItem("Token")}`
                }})
            .then(() => {
                this.props.history.push("/profile");
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
                <h1>Rediger aktivitet</h1>
                
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
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" onClick={this.displayRegistrationForm} id="registration-checkbox" required/>
                        <label className="form-check-label" htmlFor="flexCheckDefault">Registrering</label>
                    </div>
                    {/*Capacity */}
                    <div id="registration-capacity" style={{display:"none"}} className="mb-3">
                        <br/>
                        <label className="form-label">Antall plasser</label>
                        <input type="number" className="form-control" id="registration-capacity-input" required/>
                    </div>
                    {/*Reg deadline date */}
                    <div id="registration-deadline" style={{display:"none"}} className="mb-3">
                        <label htmlFor="reg-date" className="form-label">Påmelding stenger</label>
                        <br/>
                        <input type="datetime-local" className="form-control" id="reg-deadline" name="registration-closes" required/>
                    </div>
                    {/*Date */}
                    <div id="starting_time" style={{display:"none"}} className="mb-3">
                        <label htmlFor="start-date" className="form-label">Tidspunkt</label>
                        <br/>
                        <input type="datetime-local" className="form-control" id="start-date" name="start-time" required/>
                    </div>
                    {/*Location */}
                    <div id="location" style={{display:"none"}} className="mb-3">
                        <label htmlFor="activity-location" className="form-label">Sted</label>
                        <input id="activity-location-input" type="text" className="form-control"
                               placeholder="Gløshaugen" required/>
                    </div>
                </div>
                <div className="mt-3 row">
                    <div className={"d-none d-md-block col-4 pe-4"}>
                        <button className="btn btn-outline-secondary w-100" onClick={this.props.history.goBack}>Avbryt</button>
                    </div>
                    <div className={"col"}>
                        <button className="btn btn-success w-100" onClick={this.editActivity}>Lagre</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(EditActivity);
