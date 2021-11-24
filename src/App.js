import './App.css';
import Captain from './pages/Captain.js';
import Sailor from './pages/Sailor.js';
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
    // setSocket(io("http://192.168.0.252:5000"));
  }, []);

  useEffect(() => {
    if (width >= 780) {
      navigate('/captain');
    } else {
      navigate('/sailor');
    };
  }, [navigate, width]);



  return (
      <Routes>
        <Route exact path="/captain" element={<Captain socket={socket} code={generateCode}/>}/> 
        <Route exact path="/sailor" element={<Sailor socket={socket} code={generateCode}/> }/> 
      </Routes>
  );
}

export default App;