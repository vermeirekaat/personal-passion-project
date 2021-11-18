import { useState } from "react";

const Homescreen = () => {
    const [clicked, setClicked] = useState(false);

    return (
        <div className="homescreen">
        { clicked ? 
            <p>Welcome to the game!</p> :
            <button onClick={() => setClicked(true)}>Start</button>
        } 
        </div>
    )
};

export default Homescreen;