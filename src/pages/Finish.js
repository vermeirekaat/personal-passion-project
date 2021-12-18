import { useNavigate, useParams } from "react-router-dom";

const Finish = () => {

    let { message } = useParams();
    let navigate = useNavigate();

    setTimeout(() => {
        navigate("/");
    }, 5000);

    if (message === "fail") {
        return (
            <div>
                <p>Helaas, het is je niet gelukt</p>
            </div>
        )
    } 
    if (message === "finish") {
        <div>
            <h1>Proficiat, je hebt de schat gehaald!</h1>
        </div>
    }

    return (
        <div>
            <h1>Back to Home</h1>
        </div>
    )
}; 


export default Finish;