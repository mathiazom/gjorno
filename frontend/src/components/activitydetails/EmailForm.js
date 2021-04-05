import axios from 'axios';
import React from 'react';
import FormWithValidation from '../common/FormWithValidation';
import {RequiredAsterisk} from "../common/RequiredAsterisk";
import {Link, withRouter} from 'react-router-dom';
import {stringIsBlank, stringIsEmail, validateForm} from "../common/Utils";

class EmailForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activity: null,
            author: null,
            user: null,
            send_status: null
        };

        this.getActivity = this.getActivity.bind(this);
        this.getActivityAuthor = this.getActivityAuthor.bind(this);
        this.submit = this.submit.bind(this);
    }

    componentDidMount() {
        this.getUser();
        this.getActivity();
    }

    /**
     * Get the mail of the logged in user, and set it in the form.
     */
    getUser() {
        axios.get('http://localhost:8000/api/current_user/', {
            headers: {
                "Authorization": `Token ${window.localStorage.getItem("Token")}`
            }
        }).then(res => {
            this.setState({user: res.data});
            const userEmail = res.data.email;
            if (userEmail == null || !stringIsEmail(userEmail)) {
                // User does not have a valid email registered, abort
                this.props.history.push(`/activity-details/${this.props.match.params.id}`);
                return;
            }
            document.getElementById("user-email-input").value = res.data.email;
        }).catch(error => {
            console.log(error.response);
        });
    }

    /**
     * Get the activity data.
     */
    getActivity() {
        axios.get(`http://localhost:8000/api/activities/${this.props.match.params.id}/?register_view`, {
            headers: {
                "Authorization": `Token ${window.localStorage.getItem("Token")}`
            }
        }).then(res => {
            this.setState({activity: res.data})
            this.getActivityAuthor();
        }).catch(error => {
            console.log(error.response);
        });
    }

    /**
     * Set the mail based on who the owner of the activit is.
     */
    getActivityAuthor() {
        axios.get(`http://localhost:8000/api/users/${this.state.activity.user}`
        ).then(res => {
            this.setState({author: res.data})
            if (res.data.email == null || !stringIsEmail(res.data.email)) {
                // Author does not have a valid email registered, abort
                this.props.history.push(`/activity-details/${this.props.match.params.id}`);
            }
        }).catch(error => {
            console.log(error.response);
        });
    }

    /**
     * Validation rules for email form inputs
     */
    emailFormRules() {

        const emailTitleInput = document.getElementById("email-title-input");
        const emailMessageInput = document.getElementById("email-message-input");

        return [
            {
                inputEl: emailTitleInput,
                rules: [
                    {
                        isValid: !stringIsBlank(emailTitleInput.value),
                        msg: "Tittel er obligatorisk"
                    },
                    {
                        isValid: emailTitleInput.value.length <= 50,
                        msg: "Tittel kan ikke være lengre enn 50 tegn"
                    }
                ]
            },
            {
                inputEl: emailMessageInput,
                rules: [
                    {
                        isValid: !stringIsBlank(emailMessageInput.value),
                        msg: "Melding er obligatorisk"
                    }
                ]
            }
        ]

    }

    /**
     * Submit the form and send the mail.
     */
    submit() {

        if (!validateForm(this.emailFormRules())) {
            // At least one invalid input value, abort
            return;
        }

        const content = new FormData();
        content.append("title", document.getElementById("email-title-input").value);
        content.append("message", document.getElementById("email-message-input").value);

        axios.post(`http://localhost:8000/api/activities/${this.state.activity.id}/contact/`,
            content,
            {
                headers: {
                    "Authorization": `Token ${window.localStorage.getItem("Token")}`
                }
            })
            .then(res => {
                this.setState({send_status: res.status});
            })
            .catch(error => {
                console.log(error.response);
            });

    }

    render() {

        let content;

        if (this.state.send_status == null) {
            content = (
                <>
                    <p className={"fw-light text-muted fs-5"}><i>{this.state.activity?.title}</i></p>
                    <h2>Kontakt <span className={"text-success"}>{this.state.activity?.username}</span></h2>
                    <FormWithValidation submit={this.submit} submitText="Send">
                        {/*Receiver (read-only) */}
                        <div className="mt-4 mb-4">
                            <label htmlFor="author-email-input" className="form-label h5 mb-3">
                                {
                                    this.state.activity?.has_registration && "Arrangørens e-postadresse"
                                    || "Forfatterens e-postadresse"
                                }
                                <RequiredAsterisk/>
                            </label>
                            <input id="author-email-input" type="text" className="form-control" disabled
                                   value={this.state.author?.email}
                            />
                            <div className={"invalid-feedback"}/>
                        </div>
                        {/*Sender (read-only) */}
                        <div className="mb-4">
                            <label htmlFor="user-email-input" className="form-label h5 mb-3">
                                Din e-postadresse<RequiredAsterisk/>
                            </label>
                            <input id="user-email-input" type="text" className="form-control" disabled/>
                            <div className={"invalid-feedback"}/>
                        </div>
                        {/*Title */}
                        <div className="mb-4">
                            <label htmlFor="email-title-input"
                                   className="form-label h5 mb-3">
                                Tittel<RequiredAsterisk/>
                            </label>
                            <input className="form-control" id="email-title-input" type="text"/>
                            <div className={"invalid-feedback"}/>
                        </div>
                        {/*Message */}
                        <div className="mb-4">
                            <label htmlFor="email-message-input"
                                   className="form-label h5 mb-3">
                                Melding<RequiredAsterisk/>
                            </label>
                            <textarea className="form-control" id="email-message-input" rows="5"/>
                            <div className={"invalid-feedback"}/>
                        </div>
                    </FormWithValidation>
                </>
            );
        } else if (this.state.send_status === 200) {
            content = (
                <div className={"text-center"}>
                    <i className={"text-success fas fa-check-circle fa-10x"}/>
                    <p className={"text-success fs-3 mt-4 fw-bold"}>E-posten er sendt!</p>
                    <p className={"text-muted fs-5 mt-3"}>
                        {this.state.activity.username} har blitt varslet og svarer direkte til<br/><span
                        className={"text-success"}>{this.state.user.email}</span>
                    </p>
                    <Link to={`/activity-details/${this.props.match.params.id}`} className="btn btn-success mt-4">Tilbake
                        til aktiviteten</Link>
                </div>
            );
        } else {
            content = (
                <div className={"text-center"}>
                    <i className={"text-danger fas fa-exclamation-circle fa-10x"}/>
                    <p className={"text-danger fs-3 mt-4 fw-bold"}>E-posten ble <u>ikke</u> sendt!</p>
                    <p className={"text-muted fs-5 mt-3"}>
                        Last inn siden på nytt og prøv en gang til, eller kom tilbake senere.
                    </p>
                    <Link to={`/activity-details/${this.props.match.params.id}`}
                          className="btn btn-outline-secondary mt-4">Tilbake til aktiviteten</Link>
                </div>
            );
        }

        return (
            <div className="container-fluid w-50 m-5 mx-auto">
                {content}
            </div>
        );
    }
}

export default withRouter(EmailForm);