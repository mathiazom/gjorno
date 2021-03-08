import React from 'react';
import {withRouter} from 'react-router-dom';
import axios from "axios";
import MultiSelect from "react-multi-select-component";

class CreateActivity extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            selected_categories: []
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
        const title = document.getElementById("activity-title-input").value;
        const description = document.getElementById("activity-description-input").value;
        // Extract ids of selected categories
        const category_ids = this.state.selected_categories.map((category)=>{
            return category.value;
        })
        axios.post("http://localhost:8000/api/activities/",
            {
                title: title,
                description: description,
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

    render() {
        return(
            <div className="container-fluid w-50 m-5 mx-auto">
                <h1>Ny aktivitet</h1>
                <div className="row">
                    <div className="mt-3 mb-3">
                        <label htmlFor="activity-title-input" className="form-label">Tittel</label>
                        <input id="activity-title-input" type="text" className="form-control"
                               placeholder="Joggetur Gløshaugen-Heimdal" required/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="activity-description-input" className="form-label">Beskrivelse</label>
                        <textarea className="form-control" id="activity-description-input" rows="3" required
                        placeholder={"Solid joggetur på 8 km. Terrenget er nokså flatt. Anbefaler å ligge på rundt 7 km/t."}/>
                    </div>
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
                </div>

                <div className="mt-3 row">
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
