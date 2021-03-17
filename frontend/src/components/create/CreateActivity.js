import React from 'react';
import {withRouter} from 'react-router-dom';
import axios from "axios";
import ActivityForm from "../common/ActivityForm";

class CreateActivity extends React.Component {

    constructor(props) {
        super(props);
        // Bind "this" to get access to "this.props.history"
        this.createActivity = this.createActivity.bind(this);
    }

    /**
     * Function for creating a new activity.
     * Takes values from html-form and sends a POST to the API
     */
    createActivity(data) {
        axios.post("http://localhost:8000/api/activities/",
            data,
            {
                headers: {
                    "Authorization": `Token ${window.localStorage.getItem("Token")}`
                }
            })
            .then(() => {
                this.props.history.push("/");
            }).catch(error => {
                console.log(error.response);
            }
        );
    }

    render() {

        return (
            <div className="container-fluid w-50 m-5 mx-auto">
                <h1>Ny aktivitet</h1>
                <ActivityForm onSubmit={this.createActivity} submitText={"Legg ut"} />
            </div>
        );
    }
}

export default withRouter(CreateActivity);
