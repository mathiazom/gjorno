import React from 'react';
import { withRouter } from 'react-router-dom';
import axios from "axios";

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
     * Log the user off. Deletes the token in the browser.
    */
    logout() {
        axios.post("http://localhost:8000/auth/logout/",
            null,
            {
                headers: {
                    "Authorization": `Token ${window.localStorage.getItem("Token")}`
                }})
            .catch(error => {
                console.log(error.response);
            });
        window.localStorage.removeItem("Token");
        this.props.history.push("/");
        this.props.onAuthStateChanged()
    }

    render(){
        return (
            <div>
                <button onClick={() => {this.logout()}} type="button" className="btn btn-outline-success">
                    <span className={"d-none d-md-block"}>LOGG UT</span>
                    <i className="fas fa-sign-out-alt d-md-none"></i>
                </button>
            </div>
        )
    }
}

export default withRouter(LogoutButton);