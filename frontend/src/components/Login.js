import React from 'react';

const Login = () => {
    const addLogin = () => {
        document.getElementById("show").checked = true;
    }

    return (
        <div>
            <button onClick={() => {addLogin()}} type="button" className="btn btn-outline-success">
                LOGG INN
            </button>
        </div>
    )
}

export default Login;