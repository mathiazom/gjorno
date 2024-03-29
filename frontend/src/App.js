import React from 'react';
import '@fortawesome/fontawesome-free/js/all.js';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";
import './App.css';
import './components/frontpage/LoginForm.css';
import Activities from './components/frontpage/Activities';
import LoginForm from './components/frontpage/LoginForm';
import Navbar from './components/navbar/Navbar';
import CreateActivity from "./components/forms/CreateActivity";
import EditActivity from "./components/forms/EditActivity";
import Profile from './components/profile/Profile';
import EditProfile from './components/profile/EditProfile';
import { Slide, toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import ActivityDetails from './components/activitydetails/ActivityDetails';
import ScrollToTop from "./components/utils/ScrollToTop";
import ShowAllCreated from "./components/profile/created/ShowAllCreated";
import ShowAllLog from './components/profile/log/ShowAllLog';
import EmailForm from './components/activitydetails/ContactForm';
import ShowAllFavorites from "./components/profile/favorited/ShowAllFavorites";


export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            authenticated: window.localStorage.getItem('Token') != null,
            my_activities: [],
            favorite_activities: [],
            log_activities: []
        }

        this.onAuthStateChanged = this.onAuthStateChanged.bind(this)
    }

    onAuthStateChanged() {
        const oldAuthState = this.state.authenticated
        const authState = window.localStorage.getItem('Token') != null
        this.setState({
            authenticated: authState
        })
        if (oldAuthState === authState) {
            // No real change, no further actions required
            return;
        }
        if (authState) {
            axios.get('http://localhost:8000/api/current_user/',
                {
                    headers: {
                        "Authorization": `Token ${window.localStorage.getItem("Token")}`
                    }
                })
                .then(res => {
                    toast(`Hei, ${res.data.username} 🤩`, { containerId: 'main-toast-container' });
                }).catch(error => {
                    console.log(error.response);
                });
        }
        else {
            toast("Logget ut 😴", { containerId: 'main-toast-container' });
        }
    }

    render() {

        return (
            <Router>
                <ScrollToTop />
                <div className={"App"}>
                    <input type="checkbox" id="showLoginForm"/>
                    <LoginForm
                        onAuthStateChanged={this.onAuthStateChanged}
                    />
                    <ToastContainer
                        containerId={"main-toast-container"}
                        enableMultiContainer
                        className={"w-auto"}
                        toastClassName={"bg-success text-white fs-5 ps-3 pe-3"}
                        bodyClassName={"text-wrap text-break mx-auto"}
                        position={"bottom-center"}
                        autoClose={1200}
                        hideProgressBar
                        closeOnClick
                        pauseOnFocusLoss={false}
                        draggable={false}
                        pauseOnHover={false}
                        closeButton={false}
                    />
                    <ToastContainer
                        containerId={"info-toast-container"}
                        enableMultiContainer
                        transition={Slide}
                        className={"w-auto"}
                        toastClassName={"bg-white text-secondary fs-5 ps-3 pe-3"}
                        bodyClassName={"text-wrap text-break mx-auto"}
                        position={"bottom-left"}
                        autoClose={1200}
                        hideProgressBar
                        closeOnClick
                        pauseOnFocusLoss={false}
                        draggable={false}
                        pauseOnHover={false}
                        closeButton={false}
                    />
                    <div className={"main-container"}>
                        <Navbar
                            authenticated={this.state.authenticated}
                            onAuthStateChanged={this.onAuthStateChanged}
                        />
                        <Switch>
                            <Route exact path={"/"}>
                                <Activities authenticated={this.state.authenticated} />
                            </Route>
                            <ProtectedRoute exact path={"/activity/create"}>
                                <CreateActivity />
                            </ProtectedRoute>
                            <Route exact path={"/activity/:id"}>
                                <ActivityDetails
                                    authenticated={this.state.authenticated}
                                />
                            </Route>
                            <ProtectedRoute exact path={"/activity/:id/edit"}>
                                <EditActivity />
                            </ProtectedRoute>
                            <ProtectedRoute exact path={"/activity/:id/contact"}>
                                <EmailForm />
                            </ProtectedRoute>
                            <ProtectedRoute exact path={"/profile"}>
                                <Profile />
                            </ProtectedRoute>
                            <ProtectedRoute exact path={"/profile/edit"}>
                                <EditProfile />
                            </ProtectedRoute>
                            <ProtectedRoute exact path={"/profile/created"}>
                                <ShowAllCreated />
                            </ProtectedRoute>
                            <ProtectedRoute exact path={"/profile/favorites"}>
                                <ShowAllFavorites />
                            </ProtectedRoute>
                            <ProtectedRoute exact path={"/profile/log"}>
                                <ShowAllLog />
                            </ProtectedRoute>
                            {/* Redirect anything else to frontpage */}
                            <Route path={"*"}>
                                <Redirect to={{ pathname: "/" }} />
                            </Route>
                        </Switch>
                    </div>
                </div>
            </Router>
        )
    }
}

// A <Route> wrapper that redirects to login form if not authenticated
function ProtectedRoute({ path, children }) {

    // Display login form if not authenticated (as soon as page is ready)
    const toggleLogin = () => {
        document.getElementById("showLoginForm").checked = true;
    }
    const isAuthenticated = window.localStorage.getItem("Token");
    if (!isAuthenticated) {
        const showToggle = document.getElementById("showLoginForm");
        if (showToggle != null) {
            // Show login form now
            toggleLogin();
        } else {
            // Show login form as soon as page is loaded
            window.onload = () => {
                toggleLogin();
            }
        }
    }

    return (
        <Route
            path={path}
            render={({ location }) =>
                isAuthenticated ? (
                    children
                ) : (
                    <Redirect to={{ pathname: "/", state: { from: location } }} />
                )
            }
        />
    );
}

