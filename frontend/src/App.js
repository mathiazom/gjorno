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
      <Navbar/>
      <Activity />
      <Activity />
      <Activity />
      <Activity />
      <Activity />

      <LoginForm />
    </div>
  );
}

export default App;
