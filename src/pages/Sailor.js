import React from "react";
import Avatar from "../components/Avatar";
import Lives from "../components/Lives";
import Storm from "../components/Storm";

const Sailor = ({ socket }) => {

    return (
        <div>
            <h2>Sailor Screen</h2>
            <Avatar/>
            <Lives/>
            <Storm/>
        </div>
       
    )
};

export default Sailor;