import React from "react";
import Avatar from "../components/Avatar";
import Lives from "../components/Lives";
import Storm from "../components/Storm";
import Morse from "../components/Morse";
import Result from "../components/Result";
import Options from "../components/Options";

const Sailor = ({ socket }) => {

    return (
        <div>
            <h2>Sailor Screen</h2>
            <Avatar/>
            <Lives/>
            <Storm/>
            <Morse/>
            <Result/>
            <Options/>
        </div>
       
    )
};

export default Sailor;