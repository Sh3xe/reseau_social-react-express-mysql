import React from "react";

import io from "socket.io-client";
import {useParams, Link} from "react-router-dom";
import {UserContext} from "../../App.js";
import {formatDate} from "../../utils.js";

const socket = io("http://localhost:8080");

function Message({message}) {
    return (
        <div className="message">
            <header className="message-infos">
                <img src={`/${message.user.user_avatar}`} alt="" />
                <Link to={`/user/${message.user.user_id}`}>{message.user.user_name}</Link> <span className="date">{formatDate(message.date)}</span>
            </header>
            <main className="message-content">
                {message.content}
            </main>
        </div>
    );
}

function MessagesContainer({messages}) {
    // Display a list of messages
    const messages_ref = React.useRef();
    const [messages_el, setMessagesEl] = React.useState([]);

    const getMessagesEl = function() {
        // push a <Message /> el for every message
        let new_messages_el = [];

        for(let i = 0; i < messages.length; i++) {
            new_messages_el.push(
                <Message message={messages[i]} key={i}/>
            );
        }

        new_messages_el.reverse();

        if(new_messages_el.length === 0) new_messages_el = "";

        setMessagesEl(new_messages_el);
    }

    const scrollToBottom = function() {
        if(messages_ref.current !== undefined) {
            messages_ref.current.scrollTop = messages_ref.current.scrollHeight;
        }
    }

    React.useEffect(getMessagesEl, [messages, messages_ref]);

    // When all messages are rendered, we scroll to the bottom
    React.useEffect(scrollToBottom, [messages_el]);

    return (
        <div className="messages" ref={messages_ref}>
            {messages_el}
        </div>
    );
}

function UserList({users, show}) {

    if(show === false) return <div></div>;

    let users_el = [];

    for(let i = 0; i < users.length; i++) {
        const u = users[i];
        users_el.push(
            <li key={i}><img src={`/${u.user_avatar}`} alt="" /> <Link to={`/user/${u.user_id}`}>{u.user_name}</Link> <span className="since-date">Depuis 120m</span></li>
        );
    }

    return (
    <aside className="chat-aside">
        <h1>Utilisateurs</h1> <hr />
        <ul>
            {users_el}
        </ul>
    </aside>    
    );
}

function ChatForm({sendMessage}) {

    const [content, setContent] = React.useState("");

    const handleMessageChange = function(e) {
        const value = e.target.value;

        if(value.length <= 250)
            setContent(value);
    }

    const handleSubmit = function(e) {
        e.preventDefault();

        if(content.length !== 0)
            sendMessage(content);
            setContent("");
    }

    return (
        <form className="message-form">
            <input type="text" className="input t1" 
                value={content} onChange={handleMessageChange}
                placeholder="Message..." autoFocus
            />
            <button className="button col1" onClick={handleSubmit}>Submit</button>
        </form>
    );
}

export default function Chatroom() {
    // Vars
    const {user} = React.useContext(UserContext);
    const {room_id, user_to} = useParams();

    // undefined if not fetched yet, false if not found,
    // defined as object if fetched successfully
    const [chat_data, setChatData] = React.useState("");

    const [chat_messages, setChatMessages] = React.useState([]);
    const [users, setUsers] = React.useState([]);
    
    // Functions
    const sendMessage = function(content) {
        socket.emit("message", content);
    }

    const addMessage = function(message) {
        setChatMessages([message, ...chat_messages]);
    }

    // Socket logic
    React.useEffect(() => {
        // Fetch roomName
        if(room_id !== undefined) {
            fetch(`/api/chatroom/${room_id}`)
                .then(res => res.json())
                .then((room) => setChatData({...room, type:"chatroom"}))
                .catch(() => setChatData(false) );

        } else if(user_to !== undefined) {
            fetch(`/api/user/${user_to}`)
                .then(res => res.json())
                .then((user) => setChatData({...user, type:"private_room"}))
                .catch(() => setChatData(false) );
        }
        
        // Join a room or a conversation
        if(room_id !== undefined)
            socket.emit("new-user", {user_token: user.user_token, room_id});
        else if(user_to !== undefined)
            socket.emit("new-user", {user_token: user.user_token, user_to});

        // Quit the room
        return () => {
            socket.emit("chat-exit");
        }
    }, [room_id, user_to, user]);

    React.useEffect(() => {
        socket.on("chat_error", err => console.log(err));

        socket.on("last-messages", (messages) => {
            setChatMessages(messages);
        });

        socket.on("user-list", (new_users) => {
            setUsers(new_users);
        });

        socket.on("message", (msg) => {
            addMessage(msg);
        });
    // eslint-disable-next-line
    });


    const ChatroomHeader = () => {
        return (
            <header className="chat-header">
                Salon - {chat_data.chatroom_name}
                {chat_data.chatroom_admin === user.user_id ? <button className="edit-button"><Link to={`/chatroom/${room_id}/edit`}>Editer</Link></button>: ""}
            </header>
        )
    }

    const PrivateConversationHeader = () => {
        return (
            <header className="chat-header">
                Conversation - {chat_data.user_name}
            </header>
        )
    }

    return (
        <div className="container-content">
            {chat_data === false ? <div className="log-message red">
                Impossible de récuperer ce salon.
            </div>: ""} 
            <div className="chat">
                <header className="chat-header">
                    {chat_data && chat_data.type === "chatroom" ? <ChatroomHeader /> : ""}
                    {chat_data && chat_data.type === "private_room" ? <PrivateConversationHeader /> : ""}
                </header>
                <main className="chat-main">
                    <UserList users={users} show={chat_data && chat_data.type === "chatroom"}/>
                    <main className="messages-container">
                        <MessagesContainer messages={chat_messages}/>
                        <ChatForm sendMessage={sendMessage}/>
                    </main>
                </main>
            </div>
        </div>
    );
}