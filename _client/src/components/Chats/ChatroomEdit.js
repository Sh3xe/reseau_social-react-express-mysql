import React from "react";

import {useParams, useHistory} from "react-router-dom";
import Message from "../Utils/Message.js";
import {UserContext} from "../../App.js";
import {sendForm, formatDate} from "../../utils.js";

function GrantCard({user, type, addGrant, removeGrant}) {
    return (
        <div className="grant-card">
            <div className="grant-infos">
                <img src={`/${user.user_avatar}`} alt=""/>
                <span className="grantcard-username">{user.user_name}</span>
                <span className="grantcard-infos">Rejoint le {formatDate(user.user_registration)}</span>
            </div>
            <div className="grant-buttons">
                { type === "add" ? 
                    <button className="button col1" onClick={() => addGrant(user.user_id)}>Ajouter</button> : 
                    <button className="button col1" onClick={() => removeGrant(user.user_id)}>Suprimmer</button>
                }
            </div>
        </div>
    );
}

function UserManager({show, toggle, room_id}) {

    const {user} = React.useContext(UserContext);

    const [granted_users, setGrantedUsers] = React.useState([]);
    const [user_friends, setUserFriends] = React.useState([]);

    // Functions

    const getUserFriends = function() {
        fetch(`/api/user/${user.user_id}/friends`)
            .then( res => res.json() )
            .then( friends => {
                setUserFriends(friends);
            });
    }

    const getGrantedUsers = function() {
        fetch(`/api/chatroom/${room_id}/grants`)
            .then( res => res.json() )
            .then( users => {
                setGrantedUsers(users);
            });
    }

    const addGrant = function(user_id) {
        const req_data = {
            url: `/api/chatroom/${room_id}/grants`,
            method: "POST",
            type: "json"
        }

        sendForm(req_data, {user: user_id}, (err) => {
            if(!err) getGrantedUsers();
        });
    }

    const removeGrant = function(user_id) {
        fetch(`/api/chatroom/${room_id}/grant/${user_id}`, {method: "DELETE"})
            .then((res) => {
                if(res.ok) {
                    getGrantedUsers();
                }
            })
    }

    const getGrantedUsersElement = function () {
        let el = [];

        for(let i = 0; i < granted_users.length; i++) {
            el.push(
                <GrantCard key={i} user={granted_users[i]} type="remove" addGrant={addGrant} removeGrant={removeGrant} />
            );
        }

        if(el.length === 0) return "";

        return el;
    }

    const getUngrantedUsersElement = function() {
        const ungranted = user_friends.filter(u => {
            for(let i = 0; i < granted_users.length; i++) {
                if(granted_users[i].grant_user === u.user_id) return false;
            }
            return true;
        });

        if(ungranted === undefined || ungranted.length === 0) return "";

        let el = [];

        for(let i = 0; i < ungranted.length; i++) {
            el.push(
                <GrantCard key={i} user={ungranted[i]} type="add" addGrant={addGrant} removeGrant={removeGrant} />
            );
        }

        if(el.length === 0) return "";

        return el;
    }

    React.useEffect( getUserFriends , [room_id]);
    React.useEffect( getGrantedUsers, [room_id]);

    return (
        <div className="modal-window" style={{display: show ? "block": "none"}}>
            <div className="modal-head">
                <h1>Inviter des utilisateurs</h1>
                <img src="/close.png" alt="" onClick={toggle}/>
            </div>
            <div className="grant-list">
                {getUngrantedUsersElement()}
            </div>
            <div className="grant-list">
                {getGrantedUsersElement()}
            </div>
        </div>
    );
}

export default function ChatroomEdit() {
    //Vars
    const {user} = React.useContext(UserContext);
    const {room_id} = useParams();
    const history = useHistory();

    const [messages, setMessages] = React.useState([]);
    const [state, setState] = React.useState({
        title: "",
        is_private: false,
        modal_shown: false
    });

    //Functions
    const handleCheckboxChange = function(e) {
        const value = e.target.checked;
        setState({...state, is_private: value});
    }

    const handleInputChange = function(e) {
        const value = e.target.value;
        if(value.length <= 100)
            setState({...state, title: value});
    }

    const handleDelete = function() {
        fetch(`/api/chatroom/${room_id}`, {method: "DELETE"})
            .then(res => {
                if(res.ok) {
                    history.push("/chatrooms")
                } else {
                    setMessages([{content:"Impossible de suprimmer ce salon", col:"red"}])
                }
            });
    }

    const handleSubmit = function(e) {
        e.preventDefault();

        const req_params = {
            method: "PATCH",
            url: `/api/chatroom/${room_id}`,
            type: "json"
        }

        const req_body = {
            name: state.title,
            type: state.is_private ? "private": "public"
        }

        sendForm(req_params, req_body, (err) => {
            if(!err) {
                history.push(`/chatroom/${room_id}`);
            } else {
                setMessages([{content:"Impossible de mettre à jour ce salon.", col:"red"}])
            }
        })
    }

    const getRoomData = function() {
        fetch(`/api/chatroom/${room_id}`)
            .then(res => res.json())
            .then(room => {
                if (room.chatroom_admin !== user.user_id) {
                    setMessages([{content: "Vous n'avez pas les droits nécessaires pour modifier ce salon.", col: "red"}]);
                } else {
                    setState({
                        title: room.chatroom_name,
                        is_private: room.chatroom_type === "private" ? true : false
                    });
                }
            })
            .catch(() => {
                setMessages([{content: "Impossible de récuperer ce salon.", col: "red"}]);
            });
    }

    const toggleModal = function(e) {
        e.preventDefault();

        setState({...state, modal_shown: !state.modal_shown});
    }

    React.useEffect(getRoomData, []);

    //Render
    return (
        <React.Fragment>
            <UserManager room_id={room_id} show={state.modal_shown} toggle={toggleModal}/>
            <div className="form-container upload edit-form">
                <Message messages={messages}/>
                <label htmlFor="title">Titre <span className="char-counter">{`${state.title.length}/100`}</span></label>
                <input className="input t1"
                    type="text" name="title"
                    value={state.title}
                    onChange={handleInputChange}
                ></input>
                <label htmlFor="is_private">Privé ?</label>
                <input className="input t1"
                    type="checkbox" name="is_private"
                    checked={state.is_private}
                    onChange={handleCheckboxChange}
                ></input>
                <button className="button col1" onClick={toggleModal}>Gérer les utilisateurs</button>
                <button className="button col4" onClick={handleSubmit}>Modifier</button>
                <button className="button col3" onClick={handleDelete}>Suprimmer</button>
            </div>
        </React.Fragment>
    );
}