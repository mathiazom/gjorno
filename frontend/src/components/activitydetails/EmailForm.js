import axios from 'axios';
import React from 'react';
import FormWithValidation from '../common/FormWithValidation';
import {RequiredAsterisk} from "../common/RequiredAsterisk";
import {withRouter} from 'react-router-dom';
import {stringIsBlank, stringIsEmail, validateForm} from "../common/Utils";
import {toast} from "react-toastify";

class EmailForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activity: null,
            author: null,
            user: null,
            email_failed: false
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
     * Empty the page, and add a success message to the page.
     */
    addEmailSentMessage() {

        this.setState({email_failed: false});

        this.props.history.push(`/activity-details/${this.props.match.params.id}`);

        toast(`E-post sendt til ${this.state.activity?.username} 🕊`,
            {
                containerId: 'main-toast-container',
                autoClose: 3000
            }
        );

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
                const success = res.status === 200;
                this.setState({email_failed: !success});
                if (success) {
                    this.addEmailSentMessage();
                }
            })
            .catch(error => {
                console.log(error.response);
            });

    }

    render() {
        return (
            <div className="container-fluid w-50 m-5 mx-auto" id="contact-form-main-div">
                {this.state.email_failed === false &&
                <>
                    <p className={"fw-light text-muted fs-5"}><i>{this.state.activity?.title}</i></p>
                    <h2>Kontakt <span className={"text-success"}>{this.state.activity?.username}</span></h2>
                    <FormWithValidation submit={this.submit} submitText="Send">
                        {/*Receiver */}
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
                        {/*Sender */}
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
                        {/*Description */}
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
                }
                {this.state.email_failed === true &&
                    <div id="failed-main-div" className={"card"}>
                        <div id="failed-child-div" className={"card-body p-4 d-flex"}>
                            <i className={"fas fa-exclamation-circle fa-lg text-danger align-self-center me-4"} />
                            <p className={"text-muted fs-5 m-0"}>
                                <span className={"text-danger"}>E-posten ble ikke sendt!</span><br />
                                Last inn siden på nytt og prøv en gang til, eller kom tilbake senere.
                            </p>
                        </div>
                    </div>
                }

            </div>
        );
    }
}

export default withRouter(EmailForm);