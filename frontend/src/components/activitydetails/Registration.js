import axios from 'axios';
import React from 'react';
import {getDateFromString} from "../common/Utils";
import ParticipantsModal from "./ParticipantsModal";

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
        axios.get('https://api.gjorno.site/api/current_user/',
            {
                headers: {
                    "Authorization": `Token ${window.localStorage.getItem("Token")}`
                }
            })
            .then(res => {
                this.setState({user: res.data});
                if (this.props.activity?.is_author) {
                    axios.get(`https://api.gjorno.site/api/activities/${this.props.activity.id}/registrations/`,
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
        axios.post(`https://api.gjorno.site/api/activities/${this.props.activity.id}/register/`,
            null,
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

    unregister() {
        const regButton = document.getElementById("registration-button")
        // Disable registration button while sending and processing request
        regButton.disabled = true;
        axios.post(`https://api.gjorno.site/api/activities/${this.props.activity.id}/unregister/`,
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

        let actionButton;

        if (this.props.authenticated) {
            if (this.props.activity.is_author) {
                actionButton = null
            } else if (this.props.activity.is_registered) {
                actionButton = (
                    <button id={"registration-button"} className={"btn btn-danger w-100 mt-3 mb-1"}
                            onClick={this.unregister}>Meld av</button>
                )
            } else {
                if (new Date() < getDateFromString(this.props.activity.registration_deadline)) {
                    if (this.props.activity.registrations_count < this.props.activity.registration_capacity) {
                        actionButton = (
                            <button id={"registration-button"} className={"btn btn-success w-100 mt-3 mb-1"}
                                    onClick={this.register}>Meld på</button>
                        )
                    } else {
                        actionButton = (
                            <button className={"btn btn-secondary w-100 mt-3 mb-1"} disabled>Påmeldingen er
                                full</button>
                        )
                    }
                } else {
                    actionButton = (
                        <button className={"btn btn-secondary w-100 mt-3 mb-1"} disabled>Påmeldingen er
                            avsluttet</button>
                    )
                }
            }
        } else {
            actionButton = (
                <button className={"btn btn-secondary w-100 mt-3 mb-1"} disabled>Påmelding krever innlogging</button>
            )
        }


        return (
            <>
                <div><b>Påmeldte</b></div>
                {this.state.participants.length > 0 &&
                <>
                    <a type="button" className="text-success no-decoration" data-bs-toggle="modal"
                       data-bs-target="#participantsModal">
                        {this.props.activity.registrations_count} av {this.props.activity.registration_capacity}
                    </a>
                    <ParticipantsModal id={"participantsModal"} participants={this.state.participants}/>
                </>
                ||
                <label className="card-text mb-2">
                    {this.props.activity.registrations_count} av {this.props.activity.registration_capacity}
                </label>
                }
                {this.props.activity.price &&
                (<>
                    <div><b>Pris</b></div>
                    <label className="card-text mb-2">
                        {this.props.activity.price},-
                    </label>
                </>)
                }
                <div><b>Frist for påmelding</b></div>
                <label className="card-text mb-2">
                    {this.props.activity.registration_deadline.slice(0, 10).replace(/-/g, ".") + " " + this.props.activity.registration_deadline.slice(11, 16)}
                </label>
                <div><b>Dato</b></div>
                <label className="card-text mb-2">
                    {this.props.activity.starting_time.slice(0, 10).replace(/-/g, ".")}
                </label>
                <div><b>Tidspunkt</b></div>
                <label className="card-text mb-2">
                    {this.props.activity.starting_time.slice(11, 16)}
                </label>
                <div><b>Sted</b></div>
                <label className="card-text mb-2">
                    {this.props.activity.location}
                </label>
                {actionButton}
            </>
        );
    }
}
