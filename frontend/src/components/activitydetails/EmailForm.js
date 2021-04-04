import axios from 'axios';
import React from 'react';
import FormWithValidation from '../common/FormWithValidation';
import { RequiredAsterisk } from "../common/RequiredAsterisk";
import { withRouter } from 'react-router-dom';

class EmailForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activity: null,
            user: null,

        };

        this.getUserEmail = this.getUserEmail.bind(this);
        this.getActivity = this.getActivity.bind(this);
        this.getActivityAuthor = this.getActivityAuthor.bind(this);
        this.submit = this.submit.bind(this);
    }

    componentDidMount() {
        this.getUserEmail();
        this.getActivity();
    }

    /**
     * Get the mail of the logged in user, and set it in the form.
     */
    getUserEmail() {
        axios.get('http://localhost:8000/api/current_user/', {
            headers: {
                "Authorization": `Token ${window.localStorage.getItem("Token")}`
            }
        }).then(res => {
            if (res.data.email != null) {
                document.getElementById("activity-email-input").value = res.data.email;
                document.getElementById("activity-email-input").disabled = true;
            }
        }).catch(error => {
            console.log(error.response);
        });
    }

    /**
     * Get the activity data.
     */
    getActivity() {
        // Include auth token only if it exists (user is logged in)
        // otherwise browse the activity anonymously
        const headers = {}
        if (this.props.authenticated) {
            headers['Authorization'] = `Token ${window.localStorage.getItem("Token")}`
        }
        axios.get(`http://localhost:8000/api/activities/${this.props.match.params.id}/?register_view`, {
            headers: headers
        }).then(res => {
            this.setState({ activity: res.data })
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
            this.setState({ user: res.data })
            if (res.data.email != null) {
                document.getElementById("activity-receiver-input").value = res.data.email;
                document.getElementById("activity-receiver-input").disabled = true;
            }
        }).catch(error => {
            console.log(error.response);
        });
    }

    /**
     * Empty the form, and add a error message to the page.
     */
    addErrorMessage() {
        document.getElementById("contact-form-main-div").innerHTML = "";

        let i = document.createElement("i");
        i.className = "fas fa-info-circle fa-lg text-muted align-self-center me-4";

        let p = document.createElement("p");
        p.className = "text-muted fs-6 m-0";
        p.innerText = "E-posten ble ikke sendt! <br />Last inn siden på nytt og prøv en gang til, eller kom tilbake senere.";

        let child_div = document.createElement("div");
        child_div.className = "card-body p-4 d-flex";
        child_div.id = "failed-child-div";
        child_div.appendChild(i);
        child_div.appendChild(p);

        let main_div = document.createElement("div");
        main_div.className = "card";
        main_div.id = "failed-main-div";
        main_div.appendChild(child_div);

        document.getElementById("contact-form-main-div").appendChild(main_div);
    }

    /**
     * Empty the page, and add a success message to the page.
     */
    addEmailSentMessage() {
        document.getElementById("contact-form-main-div").innerHTML = "";

        let i = document.createElement("i");
        i.className = "far fa-check-circle fa-10x";

        let span = document.createElement("span");
        span.style = "color: #198754; display: table; margin:0 auto";
        span.className = "mb-3"
        span.appendChild(i);

        let h2 = document.createElement("h2");
        h2.innerText = "E-posten er sendt!";
        h2.style = "text-align: center";

        document.getElementById("contact-form-main-div").appendChild(span);
        document.getElementById("contact-form-main-div").appendChild(h2);
    }

    /**
     * Submit the form and send the mail.
     */
    submit() {
        const content = new FormData();
        content.append("sender", document.getElementById("activity-email-input").value);
        content.append("receiver", document.getElementById("activity-receiver-input").value);
        content.append("title", document.getElementById("activity-title-input").value);
        content.append("description", document.getElementById("activity-description-input").value);
        axios.post(`http://localhost:8000/api/activities/${this.state.activity.id}/contact/`,
            content,
            {
                headers: {
                    "Authorization": `Token ${window.localStorage.getItem("Token")}`
                }
            })
            .then(res => {
                if (res.status === 200) {
                    this.addEmailSentMessage();
                } else {
                    this.addErrorMessage();
                }
            })
            .catch(error => {
                console.log(error.response);
            });
    }

    render() {
        return (
            <div className="container-fluid w-50 m-5 mx-auto" id="contact-form-main-div">
                <h2>Kontakt</h2>
                <FormWithValidation submit={this.submit} submitText="Send">
                    {/*Sender */}
                    <div className="mt-3 mb-4">
                        <label htmlFor="activity-email-input" className="form-label h5 mb-3">Din e-post<RequiredAsterisk /></label>
                        <input id="activity-email-input" type="text" className="form-control"
                            placeholder="Din e-postadresse" />
                        <div className={"invalid-feedback"} />
                    </div>
                    {/*Receiver */}
                    <div className="mt-3 mb-4">
                        <label htmlFor="activity-receiver-input" className="form-label h5 mb-3">Mottaker sin e-post<RequiredAsterisk /></label>
                        <input id="activity-receiver-input" type="text" className="form-control"
                            placeholder="Mottaker sin e-postadresse" />
                        <div className={"invalid-feedback"} />
                    </div>
                    {/*Title */}
                    <div className="mb-4">
                        <label htmlFor="activity-title-input" className="form-label h5 mb-3">Tittel<RequiredAsterisk /></label>
                        <input className="form-control" id="activity-title-input" type="text"
                            placeholder={"Tittel"} />
                        <div className={"invalid-feedback"} />
                    </div>
                    {/*Description */}
                    <div className="mb-4">
                        <label htmlFor="activity-description-input" className="form-label h5 mb-3">Beskrivelse<RequiredAsterisk /></label>
                        <textarea className="form-control" id="activity-description-input" rows="5"
                            placeholder={"Hvorfor tar du kontakt?"} />
                        <div className={"invalid-feedback"} />
                    </div>
                </FormWithValidation>
            </div>
        );
    }
}

export default withRouter(EmailForm);