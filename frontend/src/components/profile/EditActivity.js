import React from 'react';
import {withRouter} from 'react-router-dom';
import axios from "axios";
import ActivityForm from "../common/ActivityForm";

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
        axios.get(`http://localhost:8000/api/activities/${this.props.match.params.id}`)
            .then(res => {
                this.setState({activity: res.data})
            })
            .catch(error => {
                console.log(error);
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
                this.props.history.push(`/activity-details/${this.props.match.params.id}/`);
            }).catch(error => {
                console.log(error.response);
            }
        );
    }

    render() {
        return(
            <div className="container-fluid w-50 m-5 mx-auto">
                <h1>Rediger aktivitet</h1>
                <ActivityForm onSubmit={this.editActivity} submitText={"Lagre"}
                    activity={this.state.activity}
                />
            </div>
        );
    }
}

export default withRouter(EditActivity);
