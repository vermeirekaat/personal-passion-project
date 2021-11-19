import './App.css';
import Computer from './pages/Computer.js';
import Player from './pages/Player.js';
import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';


const App = () => {

  const [socket, setSocket] = useState(null);

  const width = window.innerWidth;
  const navigate = useNavigate();
  const generateCode = Math.floor(1000 + Math.random() * 9000);


  useEffect(() => {
    setSocket(io("http://localhost:5000"));
  }, []);

  useEffect(() => {
    if (width >= 780) {
      navigate('/computer');
    } else {
      navigate('/player');
    };
  }, [navigate, width]);



  return (
      <Routes>
        <Route exact path="/computer" element={<Computer socket={socket} code={generateCode}/>}/> 
        <Route exact path="/player" element={<Player socket={socket} code={generateCode}/> }/> 
      </Routes>
  );
}

export default App;