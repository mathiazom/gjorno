import React from 'react'
import './App.css';
import Activity from './components/Activity';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="App">
      <Navbar/>
      <Activity />
      <Activity />
      <Activity />
      <Activity />
      <Activity />
    </div>
  );
}

export default App;
