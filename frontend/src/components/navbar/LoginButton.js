import React from 'react';
import {updatePageTitle} from "../utils/Utils";

/**
 * Button for opening LoginForm
 */
const LoginButton = () => {

    /**
     * Display the login and registration form using a checkbox.
     */
    const login = () => {
        document.getElementById("showLoginForm").checked = true;
        updatePageTitle("Logg inn");
    }

    return (
        <div>
            <button onClick={() => {login()}} type="button" className="btn btn-outline-success">
                <span className={"d-none d-md-block"}>LOGG INN</span>
                <i className="fas fa-sign-in-alt d-md-none"/>
            </button>
        </div>
    )
}

export default LoginButton;