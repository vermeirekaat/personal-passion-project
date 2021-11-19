import { useState } from "react";

const Login = ({ getInput, getUsername, getCode }) => {

    const [username, setUsername] = useState("");
    const [code, setCode] = useState("");
    const [user, setUser] = useState(false);

    const handleNameChange = (e) => {
        const input = e.target.value;
        getInput(input);
        setUsername(input);
    }

    const handleClick = () => {
        getUsername(username);
        setUser(true);
    }
    return (
        <div className="homescreen">
        { user ? 
        <div>
            <p>Welcome to the game!</p> 

            <input type="number" placeholder="code" onChange={(e) => setCode(e.target.value)}></input>
            <button onClick={() => getCode(code)}>Enter</button>
        </div>  
            :
            <div>
                <input type="text" placeholder="username" onChange={(e) => handleNameChange(e)}></input>
                <button onClick={() => handleClick()}>Start</button>
            </div>
        } 
        </div>
    )
};

export default Login;