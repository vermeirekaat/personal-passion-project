import React from "react";
import Avatar from "../components/Avatar";
import Lives from "../components/Lives";

const Sailor = ({ socket }) => {

    return (
        <div>
            <h2>Sailor Screen</h2>
            <Avatar/>
            <Lives/>
        </div>
       
    )
};

export default Sailor;