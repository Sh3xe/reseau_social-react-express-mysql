import React from "react";

import {UserContext} from "../../App.js";
import {formatDate, sendForm, getUrlQuery} from "../../utils.js";
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
            <img src={`/${friend.user_avatar}`} alt=""/>
            <div className="friendcard-infos">
                <Link to={`/user/${friend.user_id}`}>{friend.user_name}</Link>
                <span>Depuis {formatDate(friend.relation_date)}</span>
            </div>
            <button className="button col1"><Link to={`/private-message/${friend.user_id}`}>Parler</Link></button>&nbsp;&nbsp;
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
            <img src={`/${user.user_avatar}`} alt=""/>
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

    //Functions
    const getRequests = function() {
        fetch(`/api/user/${user.user_id}/requests`)
        .then(res => res.json())
        .then(users => setRequests(users))
    }

    React.useEffect(getRequests, [user]);
    
    let friends_el = [];

    for(let i = 0; i < requests.length; i++) {
        friends_el.push(
            <RequestCard key={i} request={requests[i]} refresh={getRequests}/>
        );
    }

    if(!friends_el.length) friends_el = "Vous n'avez pas de requêtes.";

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
            <img src={`/${user.user_avatar}`} alt=""/>
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
    //Vars
    const [users, setUsers] = React.useState([]);
    const [search_timeout, setSearchTimeout] = React.useState([]);
    const [state, setState] = React.useState({
        search: "",
        start: 0
    });

    const step = 8;

    //Functions
    const pageMinus = function() {
        if(state.start >= step)
            setState({...state, start: state.start + step });
    }

    const pagePlus = function() {
        if(users.length >= step + 1)
            setState({...state, start: state.start + step });
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
            step: step,
            type: "public"
        });

        fetch(`/api/users?${query_params}`)
            .then(res => res.json())
            .then(users => setUsers(users))
            .catch(()=>{console.log("problème")});
    }

    React.useEffect(searchUsers, [state.start]);
    
    React.useEffect(() => {
        if(search_timeout) {
            clearTimeout(search_timeout);
        }

        setSearchTimeout(setTimeout(searchUsers, 500));
    // eslint-disable-next-line
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
function FriendMenu({changeSection, curr_section}) {
    //Render
    return(
        <div className="friend-menu">
            <span 
                className="friend-link" id={curr_section === "search" ? "selected" : ""}
                onClick={() => changeSection("search")}
            >Rechercher</span>
            <span 
                className="friend-link" id={curr_section === "friends" ? "selected" : ""}
                onClick={() => changeSection("friends")}
            >Amis</span>
            <span 
                className="friend-link" id={curr_section === "requests" ? "selected" : ""}
                onClick={() => changeSection("requests")}
            >Requêtes</span>
        </div>
    );
}

export default function Users() {
    //Hooks
    const elements = {
        friends: <FriendList />,
        requests: <RequestList />,
        search: <FriendSearch />
    }

    const [selected_section, setSelectedSection] = React.useState("search");

    //Render
    return (
        <div className="friends-list">
            <FriendMenu changeSection={setSelectedSection} curr_section={selected_section}/>
            {elements[selected_section]}
        </div>
    );
}