import React from 'react';

/**
 * Login button component.
 */
const LoginButton = () => {

    /**
     * Function to display the login and registration form.
     */
    const login = () => {
        document.getElementById("show").checked = true;
        console.log("Current token: "+window.localStorage.getItem("Token"));
    }

    return (
        <div>
            <button id="login-button" onClick={() => {login()}} type="button" className="btn btn-outline-success">
                LOGG INN
            </button>
        </div>
    )
}

export default LoginButton;