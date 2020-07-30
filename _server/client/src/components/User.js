import React from "react";

import Message from "./Message.js";
import {sendForm} from "../utils.js";
import {UserContext} from "../App.js";
import {Link, useParams} from "react-router-dom";
import {formatDate, getUrlQuery} from "../utils.js";

function UserPost({post}) {
    return (
        <div className="post">
            <div className="post-header">
                <img src="/default_pp.png" alt=""/>
                <div className="post-infos">
                    <h1 className="post-title"> <Link to={`/post/${post.post_id}`} >{post.post_title}</Link> </h1>
                    <span className="post-subtitle">
                        Par <strong><Link to={`/user/${post.post_user}`}>{post.user_name}</Link></strong> le {formatDate(post.post_date)}
                    </span>
                </div>
            </div>
            <div className="post-preview">
                {`${post.post_content.substr(0, 96)}...`}
            </div>
        </div>
    );
}

function UserPosts({posts}) {
    let posts_el = [];

    for(let i = 0; i < posts.length; i++) {
        posts_el.push(
            <UserPost key={i} post={posts[i]}/>
        );
    }

    if(!posts.length) posts_el = "";

    return (
        <React.Fragment>
            {posts_el}
        </React.Fragment>
    );
}

function UserContent({user_id}) {
    //Hooks
    const [posts, setPosts] = React.useState([]);
    const [messages, setMessages] = React.useState([]);
    const [state, /*setState*/] = React.useState({
        start: 0,
    });

    React.useEffect(() => {

        const query_params = getUrlQuery({
            start: state.start,
            step: 8
        });

        fetch(`/api/user/${user_id}/posts?${query_params}`)
            .then(res => res.json())
            .then(posts => setPosts(posts))
            .catch(() => {
                setMessages([{content:"Impossible de récuperer les posts", col:"red"}]);
            })
    }, [user_id, state.start]);

    return (
        <div className="user-posts">
            <div className="userpost-head">
                Posts de Username
            </div>
            <div className="userpost-content">
                <Message messages={messages} />
                <UserPosts posts={posts} />
            </div>
            <div className="page-controller">
                <button className="button norm">Page Précédente</button>
                <button className="button norm">Page suivante</button>
            </div>
        </div>
    );
}

function Friend({user}) {
    return (
        <div className="friend">
            <img src="/default_pp.png" alt=""/>
            <Link to={`/user/${user.user_id}`}>{user.user_name}</Link>
            <span className="friend-date">Amis depuis {formatDate(user.relation_date)}</span>
        </div>
    );
}

function Friends({friends}) {
    let friends_el = [];

    for(let i = 0; i < friends.length; i++) {
        friends_el.push(
            <Friend key={i} user={friends[i]}/>
        );
    }
    
    if(!friends.length) friends_el = "Cet utilisateur n'a pas d'amis.";

    return (
        <div className="user-friends">
            <div className="userfriend-head"> Friends </div>
            <div className="userfriend-content">
                {friends_el}
            </div>
        </div>
    );
}

function Bio({bio}) {
    return (
        <div className="user-bio">
            <div className="userbio-head">Bio</div>
            <div className="userbio-content">{bio}</div>
        </div>
    );
}

function FriendButton({user_id}) {
    //Hooks
    const {user} = React.useContext(UserContext);

    const [relation, setRelation] = React.useState(undefined);
    const [element, setElement] = React.useState(<div></div>);

    //Functions
    const removeFriend = function() {
        const params = {
            method: "DELETE",
            url: `/api/user/${user_id}/friends`,
            type: "json"
        }

        sendForm(params, {user_id: user.user_id}, (err) => {
            if(!err) {
                getRelation();
            }
        });
    }

    const addFriend = function() {
        const params = {
            method: "POST",
            url: `/api/user/${user_id}/friends`,
            type: "json"
        }

        sendForm(params, {user_id: user.user_id}, (err) => {
            if(!err) {
                getRelation();
            }
        });
    }

    const getRelation = function() {
        if(user_id != user.user_id) {
            fetch(`/api/user/${user_id}/relation`)
                .then(res => res.json())
                .then( relation => setRelation(relation))
                .catch(()=>{});
        }
    }

    React.useEffect(getRelation, [user_id, user]);

    React.useEffect(() => {
        if(relation == undefined || user_id == user.user_id) {
            setElement(<div></div>);
            return;
        };

        if(relation == false) {
            setElement(
                <div>
                    <button className="button col1" onClick={addFriend}>Ajouter en amis</button>
                </div>
            );
            return;
        }

        if(relation.relation_status == "friends") {
            setElement(
                <div>
                    <button className="button col1">Parler</button>&nbsp;&nbsp;
                    <button className="button col1" onClick={removeFriend}>Suprimmer</button>
                </div>
            );
            return;
        }

        if(relation.relation_status == "pending") {
            setElement(
                <div>
                    <button className="button col1">Requête en attente</button>
                </div>
            );
            return;
        }
    }, [relation, user_id, user]);

    return (
        <React.Fragment>
            {element}
        </React.Fragment>
    );
}

export default function User() {
    //Hooks
    const [user, setUser] = React.useState({});
    const [friends, setFriends] = React.useState({});
    const {user_id} = useParams();

    //Functions
    React.useEffect(() => {
        fetch(`/api/user/${user_id}`)
            .then(res => res.json())
            .then(user => setUser(user))

        fetch(`/api/user/${user_id}/friends`)
            .then(res => res.json())
            .then(user => setFriends(user))
    }, [user_id]);

    //Render
    return (
        <div className="profil-container">
            <div className="profil-head">
                <img src="/default_pp.png" alt=""/>
                <h1>{user.user_name}</h1>
                <FriendButton user_id={user_id}/>
            </div>
            <div className="profil-content">
                <div className="part1">
                    <Bio bio={user.user_bio}/>
                    <Friends friends={friends}/>
                </div>
                <UserContent user_id={user_id}/>
            </div>
        </div>
    );
}