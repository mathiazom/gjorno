import React from 'react';
import {withRouter} from 'react-router-dom';
import axios from "axios";
import ActivityForm from "../common/ActivityForm";
import {updatePageTitle} from "../common/Utils";
import FormPage from "../common/FormPage";

class CreateActivity extends React.Component {

    constructor(props) {
        super(props);
        // Bind "this" to get access to "this.props.history"
        this.createActivity = this.createActivity.bind(this);
    }

    componentDidMount() {
        updatePageTitle("Ny aktivitet");
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
            .then((res) => {
                // Display details page of newly created activity
                this.props.history.push("/activity/" + res.data.id);
            }).catch(error => {
                console.log(error.response);
            }
        );
    }

    render() {

        return (
            <FormPage>
                <h1>Ny aktivitet</h1>
                <ActivityForm onSubmit={this.createActivity} submitText={"Legg ut"} />
            </FormPage>
        );
    }
}

export default withRouter(CreateActivity);
