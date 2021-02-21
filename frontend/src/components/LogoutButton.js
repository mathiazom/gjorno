import React from 'react';

/**
 * Logout button component.
 */
const LogoutButton = () => {

    /**
     * Log the user of. Deletes the token both on the server and in the browser.
    */
    const logout = () => {
        /*axios.post("http://localhost:8000/auth/logout/", {
            // Username?
        })*/
        window.localStorage.removeItem("Token");
        console.log("Logging user off...");
    }

    return (
        <div>
            <button id="logout-button" onClick={() => {logout()}} type="button" className="btn btn-outline-success">
                LOGG UT
            </button>
        </div>
    )
}

export default LogoutButton;