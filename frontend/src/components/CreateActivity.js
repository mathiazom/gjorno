import React from 'react';
import {withRouter} from 'react-router-dom';
import axios from "axios";

class CreateActivity extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            categories: []
        };

        // Bind "this" to get access to "this.props.history"
        this.createActivity = this.createActivity.bind(this);
    }

    componentDidMount() {
        axios.get('http://localhost:8000/api/categories/')
            .then(res => {
                this.setState({categories: res.data});
                let select = document.getElementById("activity-categories-input")
                for(const category of this.state.categories){
                    let option = document.createElement("option");
                    option.text = category.title;
                    option.dataset.id = category.id;
                    select.add(option);
                }
            })
            .catch(error => {
                console.log(error.response);
            })
    }

    createActivity() {
        const title = document.getElementById("activity-title-input").value;
        const description = document.getElementById("activity-description-input").value;
        let select = document.getElementById("activity-categories-input")
        const categories = []
        for(const option of select.options){
            if(option.selected){
                categories.push(option.dataset.id);
            }
        }
        const activity = {
            title: title,
            description: description,
            categories: categories
        }
        axios.post("http://localhost:8000/api/activities/", activity,
            {
                headers: {
                    "Authorization": `Token ${window.localStorage.getItem("Token")}`
                }})
            .then(() => {
                this.props.history.push("/");
            });
    }

    render() {
        return(
            <div className="container-fluid w-50 m-5 mx-auto">
                <h1>Ny aktivitet</h1>
                <div className="row">
                    <div className="mt-3 mb-3">
                        <label htmlFor="activity-title-input" className="form-label">Tittel</label>
                        <input id="activity-title-input" type="email" className="form-control"
                               placeholder="Joggetur Gløshaugen-Heimdal"/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="activity-description-input" className="form-label">Beskrivelse</label>
                        <textarea className="form-control" id="activity-description-input" rows="3"
                        placeholder={"Solid joggetur på 8 km. Terrenget er nokså flatt. Anbefaler å ligge på rundt 7 km/t."}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="activity-categories-input" className="form-label">Kategorier</label>
                        <select id="activity-categories-input" className="form-select" multiple />
                    </div>
                    <div className="mt-4">
                        <button className="btn btn-success w-100" onClick={this.createActivity}>Legg ut</button>
                    </div>
                </div>
            </div>
        );
    }

}

export default withRouter(CreateActivity);
