import './App.css';
import Users from './context/Users';
import Welcome from './pages/Welcome';
import Onboarding from './pages/Onboarding';
import Game from './pages/Game';
import Finish from './pages/Finish';
import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';

const App = () => {

  const [socket, setSocket] = useState(null);
  
  useEffect(() => {
    setSocket(io("http://localhost:5000"));
    // setSocket(io("http://192.168.0.252:5000"));
  }, []);

  return (
    <Users>
      <Routes>
        <Route exact path="/" element={<Welcome socket={socket}/>}/>
        <Route exact path="/onboarding/:player" element={<Onboarding/>}/> 
        <Route exact path="/game/:player" element={<Game/>}/>
        <Route exact path="/finish/:player/:message" element={<Finish/>}/>
      </Routes>
    </Users>
  );
}

export default App;