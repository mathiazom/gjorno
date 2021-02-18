import React from 'react';
import './App.css';
import './login.css';
import Activity from './components/Activity';
import Navbar from './components/Navbar';
import LoginForm from './components/LoginForm';

const axios = require('axios'); //proxy set to "http://localhost:8000" in package.json

export default class App extends React.Component {

  state = {
    data: {}
  }

  constructor() {
    super();
    axios.get('/api/activities/')
      .then(res => {const data = res.data;
      this.setState({ data });
    });
  }

  returnAllActivities() {
    // make loop to return a activity for each activity in the data from the server.
    // E.g. <Activity data={this.state.data[0 .. n]} />
  }

  render() {
    return (
      <div className="App">
          <input type="checkbox" id="show" />
          <LoginForm />
          <div className={"main-container"}>
              <Navbar/>
              <div className={"mx-auto"}>
                <Activity data={this.state.data[0]}/>
                <Activity data={this.state.data[1]}/>
                <Activity data={this.state.data[2]}/>
              </div>
          </div>
      </div>
    )
  }
}
