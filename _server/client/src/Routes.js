import {Route, Redirect} from "react-router-dom";
import React from 'react';

import {UserContext} from "./App.js";

import Home from "./components/Home";
import Post from "./components/Post";
import Posts from "./components/Posts";
import Register from "./components/Register";
import Login from "./components/Login";

function ProtectedRoute({component: Component, user, ...params}) {
    return (
    <Route 
        {...params}
        render={
            user ? () => {return < Component/>} : () => {return <Redirect to="/login"/>}
        }
    />);
}

export default function() {

    const {user} = React.useContext(UserContext);

    return (
        <main className="container">
            <ProtectedRoute path="/" exact component={Home} user={user}/>

            <ProtectedRoute path="/posts" exact component={Posts} user={user}/>
            <ProtectedRoute path="/post/:post_id" component={Post} user={user}/>

            <Route path="/login" exact component={Login}/>
            <Route path="/register" exact component={Register}/>
        </main>
    );
}