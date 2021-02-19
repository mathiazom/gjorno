import React from 'react';
import './App.css';
import './login.css';
import Activity from './components/Activity';
import Navbar from './components/Navbar';
import LoginForm from './components/LoginForm';
import axios from 'axios'

export default class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            data: []
        }
    }

    componentDidMount() {
        axios.get('/api/activities/')
            .then(res => {
                const data = res.data;
                this.setState({data: data});
            });
    }

    renderAllActivities() {
        // make loop to return a activity for each activity in the data from the server
        return this.state.data.map((activity) => (
            <Activity data={activity} key={activity.id}/>
        ));
    }

    render() {
        return (
            <div className="App">
                <input type="checkbox" id="show" />
                <LoginForm />
                <div className={"main-container"}>
                    <Navbar/>
                    <div className={"mx-auto"}>
                      {this.renderAllActivities()}
                    </div>
                </div>
            </div>
        )
    }
}
