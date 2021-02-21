import React from 'react';

/**
 * Login component. not sure were to take thsi regarding log out.
 * Could take a prop, true or false, based on wether the user is logged in or not.
 * On true we make a log out button with a log out function and vice versa.
 */
const LoginButton = () => {

    /**
     * Function to display the login and registration form.
     */
    const login = () => {
        document.getElementById("show").checked = true;
        //console.log(window.localStorage.getItem("Token"));
    }

    /**
     * Log the user of. Deletes the token both on the server and in the browser.
    
    const logout = () => {
        axios.post("http://localhost:8000/auth/logout/", {
            // Username?
        })
        window.localStorage.removeItem("Token");
    }
    */

    /*
        <button id="logout-button" onClick={() => {logout()}} type="button" className="btn btn-outline-success">
            LOGG UT
        </button>
    */

    return (
        <div>
            <button id="login-button" onClick={() => {login()}} type="button" className="btn btn-outline-success">
                LOGG INN
            </button>
        </div>
    )
}

export default LoginButton;