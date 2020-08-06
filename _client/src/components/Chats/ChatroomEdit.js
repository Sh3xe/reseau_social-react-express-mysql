import React from "react";

import {useParams, useHistory} from "react-router-dom";
import Message from "../Utils/Message.js";
import {UserContext} from "../../App.js";
import {sendForm} from "../../utils.js";

export default function ChatroomEdit() {
    //Vars
    const {user} = React.useContext(UserContext);
    const {room_id} = useParams();
    const history = useHistory();

    const [messages, setMessages] = React.useState([]);
    const [state, setState] = React.useState({
        title: "",
        is_private: false
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

    React.useEffect(getRoomData, []);

    //Render
    return (
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
            <button className="button col1" onClick={handleSubmit}>Modifier</button>
            <button className="button col3" onClick={handleDelete}>Suprimmer</button>
        </div>
    );
}