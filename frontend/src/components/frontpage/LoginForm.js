import React from 'react';
import {withRouter} from 'react-router-dom';
import axios from 'axios';
import {displayValidationFeedback, stringIsBlank, updatePageTitle, stringIsEmail, validateForm} from "../common/Utils";

/**
 * Component for the login form. Contain both login and registration.
 * Is opened by the LoginButton.
 */
class LoginForm extends React.Component {

    constructor(props) {
        super(props);
        // Bind "this" to get access to "this.props.history"
        this.register = this.register.bind(this);
        this.login = this.login.bind(this);
        this.switchToLogin = this.switchToLogin.bind(this);
        this.switchToRegister = this.switchToRegister.bind(this);
        this.closeLoginForm = this.closeLoginForm.bind(this);
    }

    /**
     * Function changing from Login to Register in the login pop-up.
     */
    switchToRegister() {
        document.getElementById("login-form-container").classList.add('right-panel-active');
        this.clearFeedback();
        updatePageTitle("Lag konto");
    }

    /**
     * Function changing from Register to Login in the login pop-up.
     */
    switchToLogin() {
        document.getElementById("login-form-container").classList.remove('right-panel-active');
        this.clearFeedback();
        updatePageTitle("Logg inn");
    }

    /**
     * Function for closing the login pop-up. Unchecks a checkbox (in App.js).
     * Also switches back to login panel to avoid register panel on next display of form.
     */
    closeLoginForm() {
        document.getElementById("show").checked = false;
        this.switchToLogin();
        updatePageTitle("Utforsk nye aktiviteter");
    }

    /**
     * Clear all feedback from form inputs, delayed to avoid rough transitions
     */
    clearFeedback() {
        setTimeout(() => {
            // Clear any feedback
            const container = document.getElementById("login-form-container");
            for (const feedback of container.getElementsByClassName("invalid-feedback")) {
                feedback.innerHTML = "";
            }
        }, 600);
    }

    /**
     * Collection of rules for validating input data from login form
     */
    loginFormRules() {

        const usernameInput = document.getElementById("login-username");
        const passwordInput = document.getElementById("login-password");

        return [
            {
                inputEl: usernameInput,
                rules: [
                    {
                        isValid: !stringIsBlank(usernameInput.value),
                        msg: "Brukernavn er obligatorisk"
                    }
                ]
            }, {
                inputEl: passwordInput,
                rules: [
                    {
                        isValid: !stringIsBlank(passwordInput.value),
                        msg: "Passord er obligatorisk"
                    }
                ]
            }
        ]

    }

    /**
     * Collection of rules for validating input data from registration form
     */
    registrationFormRules() {

        const usernameInput = document.getElementById("reg-username");
        const emailInput = document.getElementById("reg-email");
        const password1Input = document.getElementById("reg-password1");
        const password2Input = document.getElementById("reg-password2");

        return [
            {
                inputEl: usernameInput,
                rules: [
                    {
                        isValid: !stringIsBlank(usernameInput.value),
                        msg: "Brukernavn er obligatorisk"
                    }
                ]
            }, {
                inputEl: emailInput,
                rules: [
                    {
                        isValid: !stringIsBlank(emailInput.value),
                        msg: "E-post er obligatorisk"
                    }, {
                        isValid: stringIsBlank(emailInput.value) || stringIsEmail(emailInput.value),
                        msg: "Ugyldig e-post"
                    }
                ]
            }, {
                inputEl: password1Input,
                rules: [
                    {
                        isValid: !stringIsBlank(password1Input.value),
                        msg: "Passord er obligatorisk"
                    }, {
                        isValid: stringIsBlank(password1Input.value) || password1Input.value.length >= 8,
                        msg: "Passordet må være minst 8 tegn"
                    }
                ]
            }, {
                inputEl: password2Input,
                rules: [
                    {
                        isValid: !stringIsBlank(password2Input.value),
                        msg: "Gjenta passordet over"
                    }, {
                        isValid: stringIsBlank(password2Input.value) || password1Input.value === password2Input.value,
                        msg: "Passordene stemmer ikke overens"
                    }
                ]
            }
        ]

    }

    /**
     * Function for registering a new user. Collecting text in the form-field, and sending them as a POST to the backend.
     * Returns a token unique to the user, and storing it in the users localStorage.
     *
     * @param {*} event
     */
    register(event) {
        event.preventDefault();
        if (!validateForm(this.registrationFormRules(), false)) {
            return;
        }
        const registerButton = document.getElementById("auth-register-button");
        registerButton.disabled = true;
        const usernameInput = document.getElementById("reg-username");
        const emailInput = document.getElementById("reg-email");
        const password1Input = document.getElementById("reg-password1");
        const user = {
            "username": usernameInput.value,
            "email": emailInput.value,
            "password1": password1Input.value,
            "password2": document.getElementById("reg-password2").value,
            "is_organization": document.getElementById("organizationSwitch").checked
        };

        axios.post("http://api.gjorno.site/auth/register/", user)
            .then(res => {
                window.localStorage.setItem("Token", res.data.key);
                this.props.history.push("/");
                location.reload();
            })
            .catch(error => {
                const errorResponse = error.response?.request?.response;
                if (errorResponse === "{\"username\":[\"A user with that username already exists.\"]}") {
                    displayValidationFeedback(
                        ["Brukernavnet er allerede i bruk"],
                        usernameInput.nextElementSibling
                    );
                } else if (errorResponse === "{\"email\":[\"A user is already registered with this e-mail address.\"]}") {
                    displayValidationFeedback(
                        ["E-post allerede i bruk"],
                        emailInput.nextElementSibling
                    )
                } else if (errorResponse === "{\"password1\":[\"This password is too common.\"]}") {
                    displayValidationFeedback(
                        ["Passordet er for vanlig"],
                        password1Input.nextElementSibling
                    );
                } else {
                    displayValidationFeedback(
                        ["En feil oppstod"],
                        document.getElementById("sign-up-button-feedback")
                    );
                }
            }).finally(() => {
                registerButton.disabled = false;
            });
    }

    /**
     * Function for login. POST username and password to the backend, returned the users token if valid.
     *
     * @param {*} event
     */
    login(event) {
        event.preventDefault();
        if (!validateForm(this.loginFormRules(), false)) {
            return;
        }
        const loginButton = document.getElementById("auth-login-button");
        loginButton.disabled = true;
        axios.post("https://api.gjorno.site/auth/login/", {
            "username": document.getElementById("login-username").value,
            "password": document.getElementById("login-password").value,
        }).then(res => {
            window.localStorage.setItem("Token", res.data.key)
            this.props.history.push("/");
            this.props.onAuthStateChanged()
            this.closeLoginForm()
        }).catch(error => {
            const errorResponse = error.response?.request?.response;
            if (errorResponse === "{\"non_field_errors\":[\"Unable to log in with provided credentials.\"]}") {
                displayValidationFeedback(
                    ["Ugyldig brukernavn og passord"],
                    document.getElementById("sign-in-button-feedback")
                )
            } else {
                displayValidationFeedback(
                    ["En feil oppstod"],
                    document.getElementById("sign-up-button-feedback")
                );
            }
            console.log(error.response);
        }).finally(() => {
            loginButton.disabled = false;
        });
    }

    render() {
        return (
            <div className="login-form-container" id="login-form-container">
                <a className="close" onClick={this.closeLoginForm}/>
                <div className="form-container sign-up-container">
                    <form action="#" className={"needs-validation"} noValidate>
                        <h1>Lag konto</h1>
                        <div className={"mt-3 w-100"}>
                            <div className={"mt-3 mb-3"}>
                                <input id="reg-username" className={"rounded mt-3 mb-0"} type="text"
                                       placeholder="Brukernavn"/>
                                <div className={"invalid-feedback"}/>
                                <input id="reg-email" className={"rounded mt-3 mb-0"} type="email"
                                       placeholder="E-post"/>
                                <div className={"invalid-feedback"}/>
                                <input id="reg-password1" className={"rounded mt-3 mb-0"} type="password"
                                       placeholder="Passord"/>
                                <div className={"invalid-feedback"}/>
                                <input id="reg-password2" className={"rounded mt-3 mb-0"} type="password"
                                       placeholder="Gjenta passord"/>
                                <div className={"invalid-feedback"}/>
                                <div className="registration-checkbox mt-3 mb-3">
                                    <label className="switch">
                                        <input id="organizationSwitch" type="checkbox"/>
                                        <span className="slider round"/>
                                    </label>
                                    Organisasjon
                                </div>
                            </div>
                        </div>
                        <button id="auth-register-button" className={"mt-3"} type="submit"
                                onClick={this.register}>Registrer deg
                        </button>
                        <div id="sign-up-button-feedback" className={"invalid-feedback mt-3 text-center"}/>
                        <button className={"mt-4 d-md-none login-form-button-outline"} type={"button"}
                                onClick={this.switchToLogin}>Logg inn
                        </button>
                    </form>
                </div>
                <div className="form-container sign-in-container">
                    <form action="#" className={"needs-validation"} noValidate>
                        <h1>Logg inn</h1>
                        <div className={"mt-3 w-100"}>
                            <input id="login-username" className={"rounded mt-3 mb-0"} type="text"
                                   placeholder="Brukernavn"/>
                            <div className={"collapse invalid-feedback"}/>
                            <input id="login-password" className={"rounded mt-3 mb-0"} type="password"
                                   placeholder="Passord"/>
                            <div className={"collapse invalid-feedback"}/>
                        </div>
                        <button id="auth-login-button" className={"mt-4"} onClick={this.login}>Logg inn</button>
                        <div id="sign-in-button-feedback" className={"invalid-feedback mt-3 text-center"}/>
                        <button className={"mt-4 d-md-none login-form-button-outline"} type={"button"}
                                onClick={this.switchToRegister}>Registrer deg
                        </button>
                    </form>
                </div>
                <div className="overlay-container d-none d-md-block">
                    <div className="overlay">
                        <div className="overlay-panel overlay-left">
                            <h1>Velkommen!</h1>
                            <p>Logg inn for å kunne delta på aktiviteter!</p>
                            <button className="ghost" id="signIn" onClick={this.switchToLogin}>Logg inn</button>
                        </div>
                        <div className="overlay-panel overlay-right">
                            <h1>Heisann!</h1>
                            <p>Registrer deg for å bli med på aktiviteter!</p>
                            <button className="ghost" id="signUp" onClick={this.switchToRegister}>Registrer deg</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(LoginForm);
