import React from 'react';
import axios from 'axios';

export default class LoginForm extends React.Component {
    addClass = () => {
        document.getElementById("container").classList.add('right-panel-active');
    }

    removeClass = () => {
        document.getElementById("container").classList.remove('right-panel-active');
    }

    closeLogin = () => {
        document.getElementById("show").checked = false;
    }

    handleSubmit = event => {
        event.preventDefault();
        const user = { 
            "username": document.getElementById("reg-username").value,
            "password1": document.getElementById("reg-password1").value,
            "password2": document.getElementById("reg-password2").value,
            "phone_number": "11111111"
        };
        console.log(user);
        axios.post("http://localhost:8000/auth/register/", user)
            .then(res => { 
                console.log(res);
                {window.localStorage.setItem("Token", res.data.key)}
                this.closeLogin();
            })
            .catch(error => {
                console.log(error.response);
            })}
    

    login = () => {
        axios.post("http://localhost:8000/auth/login/", {
            "username": document.getElementById("login-username").value,
            "password": document.getElementById("login-password").value,
        }).then(res => {
            window.localStorage.setItem("Token", res.data.key)
            console.log(res.data.key);
            this.closeLogin();
        }).catch(error => {
            console.log(error.response);
    })}


    render() {
        return (
        <div className="container" id="container">
            <a className="close" onClick={this.closeLogin}/>
            <div className="form-container sign-up-container">
                <form action="#">
                    <h1>Lag konto</h1>
                    <div className={"mt-3 mb-3"}>
                        <input id="reg-username" className={"rounded"} type="text" placeholder="Brukernavn" />
                        <input id="reg-password1" className={"rounded"} type="password" placeholder="Passord" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"/>
                        <input id="reg-password2" className={"rounded"} type="password" placeholder="Gjenta passord" />
                    </div>
                    <button type="submit" onClick={this.handleSubmit}>Registrer deg</button>
                </form>
            </div>
            <div className="form-container sign-in-container">
                <form action="#">
                    <h1>Logg inn</h1>
                    <div className={"mt-3"}>
                        <input id="login-username" className={"rounded"}  type="text" placeholder="Brukernavn" required />
                        <input id="login-password" className={"rounded"}  type="password" placeholder="Passord" required />
                    </div>
                    <a href="#">Glemt passord?</a>
                    <button onClick={this.login}>Logg inn</button>
                </form>
            </div>
            <div className="overlay-container">
                <div className="overlay">
                    <div className="overlay-panel overlay-left">
                        <h1>Velkommen!</h1>
                        <p>Logg inn for å kunne delta på aktiviteter!</p>
                        <button className="ghost" id="signIn" onClick={this.removeClass}>Logg inn</button>
                    </div>
                    <div className="overlay-panel overlay-right">
                        <h1>Heisann!</h1>
                        <p>Registrer deg for å bli med på aktiviteter!</p>
                        <button className="ghost" id="signUp" onClick={this.addClass}>Registrer deg</button>
                    </div>
                </div>
            </div>
        </div>);
        }
    }