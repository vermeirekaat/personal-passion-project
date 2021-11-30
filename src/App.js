import './App.css';
import Store from './context/Store';
import Welcome from './pages/Welcome';
import Onboarding from './pages/Onboarding';
import Captain from './pages/Captain';
import Sailor from './pages/Sailor';
import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';

const App = () => {

  const [socket, setSocket] = useState(null);
  // const generateCode = Math.floor(1000 + Math.random() * 9000);
  
  useEffect(() => {
    setSocket(io("http://localhost:5000"));
    // setSocket(io("http://192.168.0.252:5000"));
  }, []);


  return (
    <Store>
      <Routes>
        <Route exact path="/" element={<Welcome socket={socket}/>}/>
        <Route exact path="/onboarding" element={<Onboarding/>}/> 
          <Route exact path="/captain" element={<Captain username="captain" socket={socket}/>}/> 
          <Route exact path="/sailor" element={<Sailor username="sailor" socket={socket}/> }/>
      </Routes>
    </Store>
  );
}

export default App;