import React from "react";
import {Link} from "react-router-dom";

export default function() {

    return (
        <div className="navigation">
            <Link to="/"> Home </Link>
            <Link to="/post"> Post </Link>
        </div>
    );
}