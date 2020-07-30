import React from "react";

import {UserContext} from "../App.js";
import {formatDate, sendForm, getUrlQuery} from "../utils.js";
import {Link} from "react-router-dom";

//FRIEND LIST
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
            <img src="/default_pp.png" alt=""/>
            <div className="friendcard-infos">
                <Link to={`/user/${friend.user_id}`}>{friend.user_name}</Link>
                <span>Depuis {formatDate(friend.relation_date)}</span>
            </div>
            <button className="button col1" onClick={removeFriend}>Supprimer</button>
        </div>
    );
}

function FriendList() {
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
        if(!new_friends_el.length) new_friends_el = "Vous n'avez pas d'amis :/";

        setFriendsEl(new_friends_el);

    }, [friends])


    return (
        <div className="friend-section_container">
            {friends_el}
        </div>
    );
}

//REQUESTS LIST
function RequestCard({request, refresh}) {
    const {user} = React.useContext(UserContext);

    const rejectRequest = function() {
        const params = {
            method: "DELETE",
            url: `/api/user/${user.user_id}/friends`,
            type: "json"
        }

        sendForm(params, {user_id: request.user_id}, (err) => {
            if(!err) {
                refresh();
            }
        });
    }

    const acceptRequest = function() {
        const params = {
            method: "PUT",
            url: `/api/user/${user.user_id}/friends`,
            type: "json"
        }

        sendForm(params, {user_id: request.user_id}, (err) => {
            if(!err) {
                refresh();
            }
        });
    }

    return (
        <div className="friend-card">
            <img src="/default_pp.png" alt=""/>
            <div className="friendcard-infos">
                <Link to={`/user/${request.user_id}`}>{request.user_name}</Link>
            </div>
            <button className="button col1" onClick={rejectRequest}>Supprimer</button>
            <button className="button col1" onClick={acceptRequest}>Accepter</button>
        </div>
    );
}

function RequestList() {
    //Hooks
    const [requests, setRequests] = React.useState([]);
    const {user} = React.useContext(UserContext);
    
    const [friends_el, setFriendsEl] = React.useState([]);

    //Functions
    const getRequests = function() {
        fetch(`/api/user/${user.user_id}/requests`)
        .then(res => res.json())
        .then(users => setRequests(users))
    }

    React.useEffect(getRequests, [user]);
    
    React.useEffect(() => {
        let new_friends_el = [];
        for(let i = 0; i < requests.length; i++) {
            new_friends_el.push(
                <RequestCard key={i} request={requests[i]} refresh={getRequests}/>
            );
        }
        if(!new_friends_el.length) new_friends_el = "Vous n'avez pas de requêtes.";

        setFriendsEl(new_friends_el);

    }, [requests])

    //Render
    return (
        <div className="friend-section_container">
            {friends_el}
        </div>
    );
}

//FRIEND SEARCH
function UserCard({user}) {
    return (
        <div className="user-card">
            <img src="/default_pp.png" alt=""/>
            <div className="usercard-infos">
                <Link to={`/user/${user.user_id}`}>{user.user_name}</Link>
                <span>Arrivé(e) le {formatDate(user.user_registration)}</span>
            </div>
        </div>
    );
}

function UserSearchContent({users}) {
    let user_el = [];
    
    for(let i = 0; i < users.length; i++) {
        user_el.push(
            <UserCard key={i} user={users[i]}/>
        );
    }
        
    if(!user_el.length) user_el = <div>Pas de résultat</div>;

    return (
        <React.Fragment>
            {user_el}
        </React.Fragment>
    );
}

function FriendSearch() {
    //Hooks
    const [users, setUsers] = React.useState([]);
    const [search_timeout, setSearchTimeout] = React.useState([]);
    const [state, setState] = React.useState({
        search: "",
        start: 0,
        step: 8
    });

    //Functions

    const pageMinus = function() {
        if(state.start >= state.step)
            setState({...state, start: state.start + state.step });
    }

    const pagePlus = function() {
        if(users.length >= state.step + 1)
            setState({...state, start: state.start + state.step });
    }

    const handleSearchChange = function(e) {
        const value = e.target.value;
        setState({
            ...state,
            search: value
        });
    }

    const searchUsers = function() {
        const query_params = getUrlQuery({
            search: state.search,
            start: state.start,
            step: state.step
        });

        fetch(`/api/users?${query_params}`)
            .then(res => res.json())
            .then(users => setUsers(users))
            .catch(()=>{console.log("problème")});
    }

    React.useEffect(searchUsers, [state.start, state.step]);
    
    React.useEffect(() => {
        if(search_timeout) {
            clearTimeout(search_timeout);
        }

        setSearchTimeout(setTimeout(searchUsers, 500));
    }, [state.search])

    //Render
    return (
        <div className="friend-section_container">
            <form action="" method="get" className="search-bar">
                <input 
                    type="text" className="input t1" placeholder="Rechercher" 
                    onChange={handleSearchChange} value={state.search}
                />
            </form>
            <UserSearchContent users={users}/>
            { users.length > 9 || state.start >=8 ?
                <div className="page-controller">
                    <button className="button norm" onClick={pageMinus}>Page précédente</button>
                    <button className="button norm" onClick={pagePlus}>Page suivante</button>
                </div> : ""
            }   
        </div>
    )
}

//MAIN
function FriendMenu({changeSection}) {
    //Hooks
    const [selected, setSelected] = React.useState("friends");

    //Functions
    React.useEffect(() => {
        changeSection(selected);
    }, [selected]);

    //Render
    return(
        <div className="friend-menu">
            <span 
                className="friend-link"
                onClick={() => setSelected("friends")}
            >Amis</span>
            <span 
                className="friend-link"
                onClick={() => setSelected("requests")}
            >Requêtes</span>
            <span 
                className="friend-link"
                onClick={() => setSelected("search")}
            >Rechercher</span>
        </div>
    );
}

export default function Friends() {
    //Hooks
    const [current_element, setCurrentElement] = React.useState(<FriendList />);

    //Functions
    const handleSectionChange = function(new_el) {
        switch(new_el) {
            case "friends":
                setCurrentElement(<FriendList />);
                break;
            case "requests":
                setCurrentElement(<RequestList />);
                break;
            case "search":
                setCurrentElement(<FriendSearch />);
                break;
            default: break;
        }
    }

    //Render
    return (
        <div className="friends-list">
            <FriendMenu changeSection={handleSectionChange}/>
            {current_element}
        </div>
    );
}