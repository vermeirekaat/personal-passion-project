import './App.css';
import Welcome from './pages/Welcome';
import Captain from './pages/Captain';
import Sailor from './pages/Sailor';
import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';
import { Route, Routes, /*useNavigate*/ } from 'react-router-dom';


const App = () => {

  const [socket, setSocket] = useState(null);
  const generateCode = Math.floor(1000 + Math.random() * 9000);


  useEffect(() => {
    setSocket(io("http://localhost:5000"));
    // setSocket(io("http://192.168.0.252:5000"));
  }, []);



  return (
      <Routes>
        <Route exact path="/" element={<Welcome socket={socket}/>}/>
        <Route exact path="/captain" element={<Captain username="captain" socket={socket} code={generateCode}/>}/> 
        <Route exact path="/sailor" element={<Sailor username="sailor" socket={socket} code={generateCode}/> }/>
      </Routes>
  );
}

export default App;