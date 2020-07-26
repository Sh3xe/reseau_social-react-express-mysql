import {Route, Redirect, Link} from "react-router-dom";
import React from 'react';

import {UserContext} from "./App.js";

import Home from "./components/Home.js";
import Post from "./components/Post.js";
import Posts from "./components/Posts.js";
import Register from "./components/Register.js";
import Login from "./components/Login.js";
import User from "./components/User.js";
import Friends from "./components/Friends.js";
import Upload from "./components/Upload.js";

function MyAccountRedirection() {

    const {user} = React.useContext(UserContext);

    return (
        <div className="redirection">
            <Link className="redirection-link" to={`/user/${user.user_id}`}>Profil</Link>
            <Link className="redirection-link" to="/friends">Amis</Link>
            <Link className="redirection-link" to="/logout">Se deconnecter</Link>
        </div>
    );
}

function PostsRedirection() {
    return (
        <div className="redirection">
            <Link className="redirection-link" to="/posts">Chercher</Link>
            <Link className="redirection-link" to="/upload">Mettre en ligne</Link>
        </div>
    );
}

function CommunityRedirection() {
    return (
        <div className="redirection">
            <Link className="redirection-link" to="/chatrooms">Salons textuels</Link>
            <Link className="redirection-link" to="/games">Jeux</Link>
        </div>
    );
}

function ProtectedRoute({component, user, ...params}) {
    return (
    <Route 
        {...params}
        render={ !user ? () => <Redirect to="/login"/> : () =>{} }
        component={ user ? component : "" }
    />);
}

export default function() {
    const {user} = React.useContext(UserContext);

    return (
        <main className="container">
            <ProtectedRoute path="/" exact component={Home} user={user}/>

            <ProtectedRoute path="/post-redirection" exact component={PostsRedirection} user={user}/>
            <ProtectedRoute path="/community-redirection" exact component={CommunityRedirection} user={user}/>
            <ProtectedRoute path="/me-redirection" exact component={MyAccountRedirection} user={user}/>

            <ProtectedRoute path="/posts" exact component={Posts} user={user}/>
            <ProtectedRoute path="/upload" exact component={Upload} user={user}/>
            <ProtectedRoute path="/user/:user_id" component={User} user={user}/>
            <ProtectedRoute path="/post/:post_id" component={Post} user={user}/>
            <ProtectedRoute path="/friends" exact component={Friends} user={user}/>

            <Route path="/login" exact component={Login}/>
            <Route path="/register" exact component={Register}/>
        </main>
    );
}