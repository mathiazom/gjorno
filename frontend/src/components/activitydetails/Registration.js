import axios from 'axios';
import React from 'react';
import {getDateFromString} from "../common/Utils";

export default class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: [],
            participants: []
        }
        this.register = this.register.bind(this);
        this.unregister = this.unregister.bind(this);
    }

    componentDidMount() {
        axios.get('http://localhost:8000/api/current_user/',
            {
                headers: {
                    "Authorization": `Token ${window.localStorage.getItem("Token")}`
                }
            })
            .then(res => {
                this.setState({user: res.data});
                if (res.data.username === this.props.activity.username) {
                    axios.get(`http://localhost:8000/api/activities/${this.props.activity.id}/registrations/`,
                        {
                            headers: {
                                "Authorization": `Token ${window.localStorage.getItem("Token")}`
                            }
                        }
                    ).then(res =>
                        this.setState({participants: res.data}),
                    ).catch(error => {
                        console.log(error.response);
                    });
                }
            }).catch(error => {
            console.log(error.response);
        });
    }

    register() {
        const regButton = document.getElementById("registration-button")
        // Disable registration button while sending and processing request
        regButton.disabled = true;
        axios.post(`http://localhost:8000/api/activities/${this.props.activity.id}/register/`,
            null,
            {
                headers: {
                    "Authorization": `Token ${window.localStorage.getItem("Token")}`
                }
            }).then(res => {
                if (res.status === 201) {
                    // Refresh activity data to see updated count
                    this.props.onUpdate();
                }
            }).catch(error => {
                console.log(error.response);
            }).finally(() => {
                // Re-enable registration button
                regButton.disabled = false;
            });
    }

    unregister() {
        const regButton = document.getElementById("registration-button")
        // Disable registration button while sending and processing request
        regButton.disabled = true;
        axios.post(`http://localhost:8000/api/activities/${this.props.activity.id}/unregister/`,
            {
                activity: this.props.activity.id,
                user: this.state.user.id
            },
            {
                headers: {
                    "Authorization": `Token ${window.localStorage.getItem("Token")}`
                }
            }).then(res => {
            if (res.status === 200) {
                // Refresh activity data to see updated count
                this.props.onUpdate();
            }
        }).catch(error => {
            console.log(error.response);
        }).finally(() => {
            // Re-enable registration button
            regButton.disabled = false;
        });
    }

    render() {
        return (
            <div className="card profileInfo mt-2">
                <div className="card-body">
                    <h5 className="card-title">Aktivitet info</h5>
                    {/*<p>{usernames}</p>  We could have a button if the current user is the owner to see all users in a pop-up. */}
                    {/*const usernames = this.state.participants.map(function(participant){ return participant["username"] + "\n"});*/}
                    <b>Påmeldte</b><br/>
                    <label className="card-text mb-2">
                        {this.props.activity.registrations_count} av {this.props.activity.registration_capacity}
                    </label>
                    <br/><b>Frist for påmelding</b><br/>
                    <label className="card-text mb-2">
                        {this.props.activity.registration_deadline.slice(0, 10).replace(/-/g, ".") + " " + this.props.activity.registration_deadline.slice(11, 16)}
                    </label>
                    <br/><b>Dato</b><br/>
                    <label className="card-text mb-2">
                        {this.props.activity.starting_time.slice(0, 10).replace(/-/g, ".")}
                    </label>
                    <br/><b>Tidspunkt</b><br/>
                    <label className="card-text mb-2">
                        {this.props.activity.starting_time.slice(11, 16)}
                    </label>
                    <br/><b>Sted</b><br/>
                    <label className="card-text mb-2">
                        {this.props.activity.location}
                    </label>
                    {this.props.activity.is_registered === true ?
                        <button id={"registration-button"} className={"btn btn-danger w-100 mt-3 mb-1"}
                                onClick={this.unregister}>Meld av</button>
                        :
                        new Date() < getDateFromString(this.props.activity.registration_deadline)
                        ? this.props.activity.registrations_count < this.props.activity.registration_capacity ? (
                                <button id={"registration-button"} className={"btn btn-success w-100 mt-3 mb-1"}
                                        onClick={this.register}>Meld på</button>
                            )
                            :
                            <button className={"btn btn-secondary w-100 mt-3 mb-1"} disabled>Påmeldingen er full</button>
                            :
                            <button className={"btn btn-secondary w-100 mt-3 mb-1"} disabled>Påmeldingen er avsluttet</button>
                    }
                </div>
            </div>
        );
    }
}
