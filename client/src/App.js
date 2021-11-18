import './App.css';
import Homescreen from './components/Homescreen.js';
import { io } from 'socket.io-client';
import { useEffect } from 'react';

const App= () => {

  useEffect(() => {
    const socket = io("http://localhost:5000");
  }, [])
  return (
    <div className="App">
      <header className="App-header">
        <h2>React x Websockets</h2>

        <Homescreen/>

      </header>
    </div>
  );
}

export default App;