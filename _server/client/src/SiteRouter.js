import {Route} from "react-router-dom";
import React from 'react';

import Home from "./components/Home";
import Post from "./components/Post";
import Posts from "./components/Posts";
import Register from "./components/Register";
import Login from "./components/Login";

export default function() {
    return (
        <main className="container">
            <Route path="/" exact component={Home}/>

            <Route path="/login" exact component={Login}/>
            <Route path="/register" exact component={Register}/>

            <Route path="/posts" exact component={Posts}/>
            <Route path="/post/:post_id" component={Post}/>
        </main>
    );
}