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
            <button onClick={() => {login()}} type="button" className="btn btn-outline-success">
                <span className={"d-none d-md-block"}>LOGG INN</span>
                <i className="fas fa-sign-in-alt d-md-none"></i>
            </button>
        </div>
    )
}

export default LoginButton;