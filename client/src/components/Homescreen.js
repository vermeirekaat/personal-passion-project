import { useState } from "react";

const Homescreen = ({ socket, getUsername }) => {

    const [username, setUsername] = useState("");
    const [user, setUser] = useState(false);

    const handleClick = () => {
        getUsername(username);
        setUser(true);
    }
    return (
        <div className="homescreen">
        { user ? 
            <p>Welcome to the game!</p> :
            <div>
                <input type="text" placeholder="username" onChange={(e) => setUsername(e.target.value)}></input>
                <button onClick={() => handleClick()}>Start</button>
            </div>
        } 
        </div>
    )
};

export default Homescreen;