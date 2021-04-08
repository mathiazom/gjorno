import axios from 'axios';
import React from 'react';
import FormWithValidation from '../forms/FormWithValidation';
import {RequiredAsterisk} from "../forms/RequiredAsterisk";
import {Link, withRouter} from 'react-router-dom';
import {updatePageTitle} from '../utils/Utils';
import {displayValidationFeedback, stringIsBlank, stringIsEmail, validateForm} from "../utils/ValidationUtils";
import FormPage from "../forms/FormPage";

/**
 * Page for sending email message to author of an activity
 */
class ContactForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            activity: null,
            user_email: null,
            send_status: null
        };

        this.getActivity = this.getActivity.bind(this);
        this.checkAuthorEmail = this.checkAuthorEmail.bind(this);
        this.submit = this.submit.bind(this);
    }

    componentDidMount() {
        this.getUserEmail();
        this.getActivity();
    }

    getUserEmail() {
        axios.get('http://localhost:8000/api/current_user/', {
            headers: {
                "Authorization": `Token ${window.localStorage.getItem("Token")}`
            }
        }).then(res => {
            const userEmail = res.data.email;
            if (userEmail == null || !stringIsEmail(userEmail)) {
                // User does not have a valid email registered, abort
                this.props.history.push(`/activity/${this.props.match.params.id}`);
                return;
            }
            this.setState({user_email: res.data.email});
        }).catch(error => {
            console.log(error.response);
        });
    }

    getActivity() {
        axios.get(`http://localhost:8000/api/activities/${this.props.match.params.id}/?register_view`, {
            headers: {
                "Authorization": `Token ${window.localStorage.getItem("Token")}`
            }
        }).then(res => {
            this.setState({activity: res.data})
            this.checkAuthorEmail();
        }).catch(error => {
            console.log(error.response);
        });
    }

    /**
     * Make sure author has a registered email address
     */
    checkAuthorEmail() {
        axios.get(`http://localhost:8000/api/users/${this.state.activity.user}`
        ).then(res => {
            updatePageTitle("Kontakt " + res.data.username);
            if (res.data.email == null || !stringIsEmail(res.data.email)) {
                // Author does not have a valid email registered, abort
                this.props.history.push(`/activity/${this.props.match.params.id}`);
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

        const submitButton = document.getElementById("email-submit-button");
        submitButton.disabled = true;

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
                displayValidationFeedback(
                    ["En feil oppstod"],
                    submitButton.nextElementSibling
                );
                console.log(error.response);
            })
            .finally(() => {
                submitButton.disabled = false;
            });

    }

    render() {

        let content;

        if (this.state.send_status == null) {
            content = (
                <>
                    <p className={"fw-light text-muted fs-5"}><i>{this.state.activity?.title}</i></p>
                    <h2>Kontakt <span className={"text-success"}>{this.state.activity?.username}</span></h2>
                    <FormWithValidation submitId={"email-submit-button"} submit={this.submit} submitText="Send">
                        {/*Title */}
                        <div className="mt-4 mb-4">
                            <label htmlFor="email-title-input"
                                   className="form-label h5 mb-3">
                                Tittel<RequiredAsterisk/>
                            </label>
                            <input id="email-title-input" className="form-control" type="text"/>
                            <div className={"invalid-feedback"}/>
                        </div>
                        {/*Message */}
                        <div className="mb-4">
                            <label htmlFor="email-message-input"
                                   className="form-label h5 mb-3">
                                Melding<RequiredAsterisk/>
                            </label>
                            <textarea id="email-message-input" className="form-control" rows="5"/>
                            <div className={"invalid-feedback"}/>
                        </div>
                        {/*Sender (read-only) */}
                        <div className="mb-4">
                            <label htmlFor="user-email-input" className="form-label h5 mb-3">
                                Din e-postadresse<RequiredAsterisk/>
                            </label>
                            <input id="user-email-input" type="text" className="form-control" disabled
                                   value={this.state.user_email}
                            />
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
                        className={"text-success"}>{this.state.user_email}</span>
                    </p>
                    <Link to={`/activity/${this.props.match.params.id}`} className="btn btn-success mt-4">Tilbake
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
                    <Link to={`/activity/${this.props.match.params.id}`}
                          className="btn btn-outline-secondary mt-4">Tilbake til aktiviteten</Link>
                </div>
            );
        }

        return (
            <FormPage>
                {content}
            </FormPage>
        );
    }
}

export default withRouter(ContactForm);
