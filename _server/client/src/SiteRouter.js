import {Route} from "react-router-dom";
import React from 'react';

import Home from "./components/Home";
import Post from "./components/Post";
import Register from "./components/Register";
import Login from "./components/Login";

export default function() {
    return (
        <main className="container">
            <Route path="/" exact component={Home}/>

            <Route path="/login" exact component={Login}/>
            <Route path="/register" exact component={Register}/>

            <Route path="/post/" component={Post}/>
            <Route path="/posts" component={Post}/>
        </main>
    );
}