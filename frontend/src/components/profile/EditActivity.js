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
                const categories = activity.categories;
                const selected = []
                for (const category of this.state.categories){
                    if(categories.indexOf(category.value) !== -1){
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
        const title = document.getElementById("activity-title-input").value;
        const description = document.getElementById("activity-description-input").value;
        const ingress = document.getElementById("activity-ingress-input").value;
        // Extract ids of selected categories
        const category_ids = this.state.selected_categories.map((category)=>{
            return category.value;
        })
        axios.put(`http://localhost:8000/api/activities/${this.props.match.params.id}/`,
            {
                title: title,
                ingress: ingress,
                description: description,
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

    render() {
        return(
            <div className="container-fluid w-50 m-5 mx-auto">
                <h1>Rediger aktivitet</h1>
                <div className="row">
                    <div className="mt-3 mb-3">
                        <label htmlFor="activity-title-input" className="form-label">Tittel</label>
                        <input id="activity-title-input" type="text" className="form-control"
                               placeholder="Joggetur Gløshaugen-Heimdal" required/>
                    </div>
                     <div className="mb-3">
                        <label htmlFor="activity-ingress-input" className="form-label">Ingress</label>
                        <textarea className="form-control" id="activity-ingress-input" rows="2" required
                                  placeholder={"Fin joggetur på 8km med flatt terreng."}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="activity-description-input" className="form-label">Beskrivelse</label>
                        <textarea className="form-control" id="activity-description-input" rows="5" required
                                  placeholder={"Solid joggetur på 8 km. Terrenget er nokså flatt, med noen små bakker. Anbefaler å ligge på rundt 7 km/t, men dette er ikke kritisk."}/>
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
                        <button className="btn btn-success w-100" onClick={this.editActivity}>Lagre</button>
                    </div>
                </div>
            </div>
        );
    }

}

export default withRouter(EditActivity);
