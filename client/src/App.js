import './App.css';
import Homescreen from './components/Homescreen.js';
import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';

const App= () => {

  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    setSocket(io("http://localhost:5000"));
  }, []);

  useEffect(() => {
    socket?.emit("newUser", username);
  }, [socket, username]);

  return (
    <div className="App">
      <header className="App-header">
        <h2>React x Websockets</h2>

        <Homescreen getUsername={(user) => setUsername(user)} socket={socket}/>

      </header>
    </div>
  );
}

export default App;