import React from 'react';
import {withRouter} from 'react-router-dom';
import axios from "axios";
import ActivityForm from "../common/ActivityForm";
import {displayValidationFeedback, updatePageTitle} from "../common/Utils";
import FormPage from "../common/FormPage";

class EditActivity extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            activity: null
        }

        // Bind "this" to get access to "this.props.history"
        this.editActivity = this.editActivity.bind(this);
    }

    componentDidMount() {
        updatePageTitle("Rediger aktivitet");
        axios.get(`http://localhost:8000/api/activities/${this.props.match.params.id}`)
            .then(res => {
                this.setState({activity: res.data})
            })
            .catch(error => {
                console.log(error.response);
            });
    }

    /**
     * Send the edited activity back to the server, using a PUT.
     */
    editActivity(activity) {
        axios.put(`http://localhost:8000/api/activities/${this.props.match.params.id}/`,
            activity,
            {
                headers: {
                    "Authorization": `Token ${window.localStorage.getItem("Token")}`
                }
            })
            .then(() => {
                this.props.history.push(`/activity/${this.props.match.params.id}/`);
            }).catch(error => {
                const errorResponse = error.response?.request?.response;
                if(errorResponse === "\"Cannot decrease capacity below current number of registrations\""){
                    displayValidationFeedback(
                        ["Må være minst like mange plasser som antall påmeldte"],
                        document.getElementById("registration-capacity-input").nextElementSibling
                    )
                }
                console.log(error.response);
            }
        );
    }

    render() {
        return(
            <FormPage>
                <h1>Rediger aktivitet</h1>
                <ActivityForm onSubmit={this.editActivity} submitText={"Lagre"}
                    activity={this.state.activity}
                    disableHasRegistration
                />
            </FormPage>
        );
    }
}

export default withRouter(EditActivity);
