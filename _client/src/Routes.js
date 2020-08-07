import {Route, Link, Redirect} from "react-router-dom";
import React from 'react';
import {UserContext} from "./App.js";

import Home from "./components/Home.js";

import Login        from "./components/Authentication/Login.js";
import Register     from "./components/Authentication/Register.js";

import Upload       from "./components/Posts/Upload.js";
import Edit         from "./components/Posts/Edit.js";
import Post         from "./components/Posts/Post.js";
import Posts        from "./components/Posts/Posts.js";

import User         from "./components/Users/User.js";
import Users        from "./components/Users/Users.js";
import Dashboard    from "./components/Users/Dashboard.js";

import Chatrooms    from "./components/Chats/Chatrooms.js";
import Chatroom     from "./components/Chats/Chatroom.js";
import ChatroomEdit from "./components/Chats/ChatroomEdit.js";

function MyAccountRedirection() {
    const {user} = React.useContext(UserContext);
    return (
        <div className="redirection">
            <Link className="redirection-link" to={`/user/${user.user_id}`}>Profil</Link>
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
            <Link className="redirection-link" to="/users">Utilisateurs</Link>
        </div>
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
                <Route path="/upload" exact component={Upload} />
                <Route path="/post/:post_id/edit" component={Edit} />
                <Route path="/post/:post_id" exact component={Post} />

                <Route path="/user/:user_id" exact component={User} />
                <Route path="/users" exact component={Users} /> 
                <Route path="/dashboard" exact component={Dashboard} /> 

                <Route path="/chatrooms" exact component={Chatrooms} /> 
                <Route path="/chatroom/:room_id/edit" exact component={ChatroomEdit} /> 
                <Route path="/chatroom/:room_id" exact component={Chatroom}/> 
                <Route path="/private-message/:user_to" exact component={Chatroom}/> 


            </React.Fragment>: <React.Fragment>
                <Route path="/register" exact component={Register}/>
                <Redirect from="*" to="/"/>
                <Route path="/" exact component={Login}/>
            </React.Fragment>
            }
        </main>
    );
}