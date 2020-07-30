import {Route, Link, Redirect} from "react-router-dom";
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
import Edit from "./components/Edit.js";
import Logout from "./components/Logout.js";
import Dashboard from "./components/Dashboard.js";

function MyAccountRedirection() {
    const {user} = React.useContext(UserContext);
    return (
        <div className="redirection">
            <Link className="redirection-link" to={`/user/${user.user_id}`}>Profil</Link>
            <Link className="redirection-link" to="/friends">Amis</Link>
            <Link className="redirection-link" to="/dashboard">Paramètres</Link>
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

function NotFound() {
    return (
        <h1>404 Cette page n'existe pas.</h1>
    );
}

export default function Routes() {

    const {user} = React.useContext(UserContext);

    return (
        <main className="container">
            { user !== false ?
            <React.Fragment>
                <Route path="/" exact component={Home} />
                <Route path="/post-redirection" exact component={PostsRedirection} />
                <Route path="/community-redirection" exact component={CommunityRedirection} />
                <Route path="/me-redirection" exact component={MyAccountRedirection} />

                <Route path="/posts" exact component={Posts} />
                <Route path="/logout" exact component={Logout} />

                <Route path="/upload" exact component={Upload} />
                <Route path="/user/:user_id" exact component={User} />
                <Route path="/post/:post_id" exact component={Post} />
                <Route path="/post/:post_id/edit" component={Edit} />
                <Route path="/friends" exact component={Friends} /> 
                <Route path="/dashboard" exact component={Dashboard} /> 

                <Redirect from="*" to="/not-found"/>
                <Route path="/not-found" component={NotFound}/>
            </React.Fragment>: <React.Fragment>
                <Route path="/register" exact component={Register}/>
                <Redirect from="*" to="/login"/>
                <Route path="/" exact component={Login}/>
            </React.Fragment>
            }
        </main>
    );
}