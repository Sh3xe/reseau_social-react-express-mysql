import React from "react";

import {UserContext} from "../App.js";
import {formatDate, sendForm} from "../utils.js";
import {Link} from "react-router-dom";

function FriendCard({friend}) {
    const {user} = React.useContext(UserContext);

    const removeFriend = function() {
        const params = {
            method: "DELETE",
            url: `/api/user/${user.user_id}/friends`,
            type: "json"
        }

        sendForm(params, {user_id: friend.user_id});
    }

    return (
        <div className="friend-card">
            <img src="https://via.placeholder.com/64.png/09f/fff" alt=""/>
            <div className="friendcard-infos">
                <Link to={`/user/${friend.user_id}`}>{friend.user_name}</Link>
                <span>Depuis {formatDate(friend.relation_date)}</span>
            </div>
            <button className="button col1" onClick={removeFriend}>Supprimer</button>
        </div>
    );
}

export default function Friends() {

    const [friends, setFriends] = React.useState([]);
    const {user} = React.useContext(UserContext);
    
    const [friends_el, setFriendsEl] = React.useState([]);

    React.useEffect(() => {
        fetch(`/api/user/${user.user_id}/friends`)
        .then(res => res.json())
        .then(users => setFriends(users))
    }, [user]);
    
    
    React.useEffect(() => {
        let new_friends_el = [];
        for(let i = 0; i < friends.length; i++) {
            new_friends_el.push(
                <FriendCard key={i} friend={friends[i]}/>
            );
        }
        if(!new_friends_el.length) new_friends_el = "";

        setFriendsEl(new_friends_el);

    }, [friends])


    return (
        <div className="friends-list"> {friends_el} </div>
    );
}