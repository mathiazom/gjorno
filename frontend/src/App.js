import React from 'react';
import '@fortawesome/fontawesome-free/js/all.js';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";
import './App.css';
import './login.css';
import Activities from './components/frontpage/Activities';
import LoginForm from './components/frontpage/LoginForm';
import Navbar from './components/navbar/Navbar';
import CreateActivity from "./components/create/CreateActivity";
import EditActivity from "./components/profile/EditActivity";
import Profile from './components/profile/Profile';
import EditProfile from './components/profile/EditProfile';
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import ActivityDetails from './components/activitydetails/ActivityDetails';
import ScrollToTop from "./components/common/ScrollToTop";


export default class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            authenticated: window.localStorage.getItem('Token') != null
        }

        this.onAuthStateChanged = this.onAuthStateChanged.bind(this)
    }

    onAuthStateChanged() {
        const oldAuthState = this.state.authenticated
        const authState = window.localStorage.getItem('Token') != null
        this.setState({
            authenticated: authState
        })
        if(oldAuthState === authState){
            // No real change, no further actions required
            return;
        }
        if(authState){
            axios.get('http://localhost:8000/api/current_user/',
                {
                    headers: {
                        "Authorization": `Token ${window.localStorage.getItem("Token")}`
                    }})
                .then(res => {
                    toast(`Hei, ${res.data.username} 🤩`);
                }).catch(error => {
                    console.log(error.response);
                });
        }
        else{
            toast("Logget ut 😴");
        }
    }

    render() {

        return (
            <Router>
                <ScrollToTop/>
                <div className={"App"}>
                    <input type="checkbox" id="show" />
                    <LoginForm
                        onAuthStateChanged={this.onAuthStateChanged}
                    />
                    <ToastContainer
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
                    <div className={"main-container"}>
                        <Navbar
                            authenticated={this.state.authenticated}
                            onAuthStateChanged={this.onAuthStateChanged}
                        />
                        <Switch>
                            <Route exact path={"/"}>
                                <Activities />
                            </Route>
                            <Route exact path ={"/activity-details/:id"}>
                                <ActivityDetails
                                    authenticated={this.state.authenticated}
                                />
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

