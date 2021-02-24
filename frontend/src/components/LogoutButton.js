import React from 'react';
import { withRouter } from 'react-router-dom';

/**
 * Logout button component.
 */
class LogoutButton extends React.Component {

    constructor(props) {
        super(props);

        // Bind "this" to get access to "this.props.history"
        this.logout = this.logout.bind(this);
    }

    /**
     * Log the user of. Deletes the token both on the server and in the browser.
    */
    logout() {
        window.localStorage.removeItem("Token");
        this.props.history.push("/");
        location.reload();
    }

    render(){
        return (
            <div>
                <button id="logout-button" onClick={() => {this.logout()}} type="button" className="btn btn-outline-success">
                    LOGG UT
                </button>
            </div>
        )
    }
}

export default withRouter(LogoutButton);