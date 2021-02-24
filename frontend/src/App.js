import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";
import './App.css';
import './login.css';
import Activities from './components/Activities';
import CreateActivity from "./components/CreateActivity";
import EditActivity from "./components/EditActivity";
import Profile from './components/Profile';
import Navbar from './components/Navbar';
import LoginForm from './components/LoginForm';
import EditProfile from './components/EditProfile';

export default class App extends React.Component {

    render() {

        return (
            <Router>
                <div className={"App"}>
                    <input type="checkbox" id="show" />
                    <LoginForm />
                    <div className={"main-container"}>
                        <Navbar/>
                        <Switch>
                            <Route exact path={"/"}>
                                <Activities />
                            </Route>
                            <ProtectedRoute exact path={"/create-activity"}>
                                <CreateActivity />
                            </ProtectedRoute>
                            <ProtectedRoute exact path={"/edit-activity/:id"}>
                                <EditActivity />
                            </ProtectedRoute>
                            <ProtectedRoute exact path={"/profile"}>
                                <Profile />
                            </ProtectedRoute>
                            <ProtectedRoute exact path={"/profile/edit"}>
                                <EditProfile />
                            </ProtectedRoute>
                            {/* Redirect anything else to frontpage */}
                            <Route path={"*"}>
                                <Redirect to={{pathname: "/"}}/>
                            </Route>
                        </Switch>
                    </div>
                </div>
            </Router>
        )
    }
}

// A <Route> wrapper that redirects to login form if not authenticated
function ProtectedRoute({path, children}) {

    // Display login form if not authenticated (as soon as page is ready)
    const toggleLogin = () => {
        document.getElementById("show").checked = true;
    }
    const isAuthenticated = window.localStorage.getItem("Token");
    if(!isAuthenticated){
        const showToggle = document.getElementById("show");
        if(showToggle != null){
            // Show login form now
            toggleLogin();
        }else{
            // Show login form as soon as page is loaded
            window.onload = () => {
                toggleLogin();
            }
        }
    }

    return (
        <Route
            path={path}
            render={({location}) =>
                isAuthenticated ? (
                    children
                ) : (
                    <Redirect to={{pathname: "/", state: {from: location}}}/>
                )
            }
        />
    );
}

