import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PopUp from "../components/PopUp";
import { usersContext } from "../context/Users";

const Finish = () => {

    let { message } = useParams();
    // eslint-disable-next-line no-unused-vars
    const [users, setUsers] = useContext(usersContext);
    const socket = users[0].socket;
    let navigate = useNavigate();

    setTimeout(() => {
        const boolean = true;
        socket.emit("removeUser");
        navigate(`/${boolean}`);
    }, 20000);

    return (
        <PopUp message={message}/>
    )
}; 


export default Finish;