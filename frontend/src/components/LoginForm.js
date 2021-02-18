import React from 'react';

function LoginForm() {
    const addClass = () => {
        document.getElementById("container").classList.add('right-panel-active');
    }

    const removeClass = () => {
        document.getElementById("container").classList.remove('right-panel-active');
    }

    const closeLogin = () => {
        document.getElementById("show").checked = false;
    }

    //const axios = require('axios');

    /*const register = () => {
        axios.post({
            "username": "",
            "email": "",
            "password1": "",
            "password2": "",
        }, "http://localhost:8000/auth/register/"))
        .then(res => {window.localStorage.setItem("Token", res.data.key)}
    }*/

    /*const login = () => {
        axios.post({
            "username": "",
            "password": "",
        }, "http://localhost:8000/auth/login/")
        .then(res => {window.localStorage.setItem("Token", res.data.key)})
    }*/

    return (
        <div className="container" id="container">
            <a className="close" onClick={closeLogin}></a>
            <div className="form-container sign-up-container">
                <form action="#">
                    <h1>Lag konto</h1>
                    <span>med navn, epost og passord</span>
                    <input type="text" placeholder="Navn" />
                    <input type="email" placeholder="Epost" />
                    <input type="password" placeholder="Passord" />
                    <button>Registrer deg</button>
                </form>
            </div>
            <div className="form-container sign-in-container">
                <form action="#">
                    <h1>Logg inn</h1>
                    <span>med brukernavn og passord</span>
                    <input type="email" placeholder="Brukernavn" required />
                    <input type="password" placeholder="Passord" required />
                    <a href="#">Glemt passord?</a>
                    <button>Logg inn</button>
                </form>
            </div>
            <div className="overlay-container">
                <div className="overlay">
                    <div className="overlay-panel overlay-left">
                        <h1>Velkommen!</h1>
                        <p>Logg inn for å kunne delta på aktiviteter!</p>
                        <button className="ghost" id="signIn" onClick={() => { removeClass() }}>Logg inn</button>
                    </div>
                    <div className="overlay-panel overlay-right">
                        <h1>Heisann!</h1>
                        <p>Registrer deg for å bli med på aktiviteter!</p>
                        <button className="ghost" id="signUp" onClick={() => { addClass() }}>Registrer deg</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginForm;