import { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../context/Store";

const Onboarding = () => {
    // eslint-disable-next-line
    const [state, dispatch] = useContext(Context);

    console.log(state.users);
    let currentUser;
    let socketId;
    if (state.users.length > 0) {
        currentUser = state.users[0].user;
        socketId = state.users[0].socket;
    }
    
    console.log(currentUser, socketId);

    if (currentUser === "captain") {
        return (
            <p>Captain</p>
        )
    }; 

    if (currentUser === "sailor") {
        return (
            <p>Sailor</p>
        )
    };


    return (
        <Link to="/">No user was found</Link>
    )
}; 

export default Onboarding;