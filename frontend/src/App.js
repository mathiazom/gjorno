import React from 'react'
import './App.css';
import './login.css';
import Activity from './components/Activity';
import Navbar from './components/Navbar';
import LoginForm from './components/LoginForm';

function App() {
    return (
        <div className="App">
            <input type="checkbox" id="show" />
            <LoginForm />
            <div className={"main-container"}>
                <Navbar/>
                <div className={"mx-auto"}>
                    <Activity/>
                    <Activity/>
                    <Activity/>
                    <Activity/>
                    <Activity/>
                </div>
            </div>
        </div>
    );
}

export default App;
