import './App.css';
import Users from './context/Users';
import Captain from './pages/Captain';
import Sailor from './pages/Sailor';
import Onboarding from './pages/Onboarding';
import Game from './pages/Game';
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
        <Route exact path="/captain" element={<Captain socket={socket}/>}/>
        <Route exact path="/sailor" element={<Sailor socket={socket}/>}/>
        <Route exact path="/onboarding/:player" element={<Onboarding/>}/> 
        <Route exact path="/game/:player" element={<Game/>}/>
      </Routes>
    </Users>
  );
}

export default App;