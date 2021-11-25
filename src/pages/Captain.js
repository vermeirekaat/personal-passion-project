import React from "react";
import Avatar from "../components/Avatar";
import Lives from "../components/Lives";
import Route from "../components/Route";
import Morse from "../components/Morse";
import Result from "../components/Result";
import Obstacle from "../components/Obstacle";
import CheatSheet from "../components/CheatSheet";

const Captain = ({ socket }) => {
    
    return (
        <div>
            <h2>Captain Screen</h2>
            <Avatar/>
            <Lives/>
            <Route/>
            <Morse/>
            <Result/>
            <Obstacle/>
            <CheatSheet/>
        </div>
    )
};

export default Captain;