import './App.css';
import Activity from './components/Activity';
import Title from './components/Title';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="App">
      <Navbar/>
      <Title />
      <Activity />
      <Activity />
      <Activity />
      <Activity />
    </div>
  );
}

export default App;
