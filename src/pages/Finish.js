import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PopUp from "../components/PopUp";
import { usersContext } from "../context/Users";

const Finish = () => {

    let { message } = useParams();
    // eslint-disable-next-line no-unused-vars
    const [users, setUsers] = useContext(usersContext);
    const socket = users[0].socket;
    let navigate = useNavigate();

    useEffect(() => {
        socket?.emit("page", "finish");
    });

    useEffect(() => {
        socket?.on("restartGame", (boolean) => {
            if (boolean) {
                socket.emit("removeUser");
                navigate(`/${boolean}`);
            }
        })
    }, [navigate, socket]);

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