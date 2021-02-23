import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import './App.css';
import './login.css';
import Activities from './components/Activities';
import CreateActivity from "./components/CreateActivity";
import Profile from './components/Profile';
import Navbar from './components/Navbar';
import LoginForm from './components/LoginForm';

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
                            <Route exact path={"/create-activity"}>
                                <CreateActivity />
                            </Route>
                            <Route exact path={"/profile"}>
                                <Profile />
                            </Route>
                        </Switch>
                    </div>
                </div>
            </Router>
        )
    }
}

