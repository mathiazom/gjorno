import React from 'react';
import {updatePageTitle} from "../common/Utils";

/**
 * Login button component.
 */
const LoginButton = () => {

    /**
     * Display the login and registration form using a checkbox.
     */
    const login = () => {
        document.getElementById("show").checked = true;
        updatePageTitle("Logg inn");
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