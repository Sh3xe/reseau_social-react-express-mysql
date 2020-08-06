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
        // scroll to the bottom
        if(messages_ref.current !== undefined) {
            console.log(messages_ref.current, messages_ref.current.scrollHeight)
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

function UserList({users}) {
    let users_el = []

    for(let i = 0; i < users.length; i++) {
        users_el.push(
            <li key={i}><img src={`/${users[i].user_avatar}`} alt="" /> {users[i].user_name} <span className="since-date">Depuis 120m</span></li>
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
    const {room_id} = useParams();

    const [room_name, setRoomName] = React.useState("");
    const [chat_messages, setChatMessages] = React.useState([]);
    const [users, setUsers] = React.useState([]);
    
    // Functions
    const sendMessage = function(content) {
        socket.emit("message", content);
    }

    const addMessage = function(message) {
        console.log(chat_messages)
        //setChatMessages([...chat_messages, message]);
    }

    // Socket logic
    React.useEffect(() => {
        // Fetch roomName
        fetch(`/api/chatroom/${room_id}`)
        .then(res => res.json())
        .then(({chatroom_name}) => setRoomName(chatroom_name))
        
        // Join a room
        socket.emit("new-user", {user_token: user.user_token, room_id});

        // Quit the room
        return () => {
            socket.emit("chat-exit");
        }
    }, [room_id, user]);

    React.useEffect(() => {
        socket.on("chat_error", err => console.log(err));

        socket.on("last-messages", (message_list) => {
            let messages = [];

            // We reformat the messages data to the
            // format used by the app
            for(let i = 0; i < message_list.length; i++) {
                messages.push({
                    content: message_list[i].message_content,
                    user: {
                        user_id: message_list[i].user_id,
                        user_avatar: message_list[i].user_avatar,
                        user_name: message_list[i].user_name
                    },
                    date: message_list[i].message_date
                });
            }

            setChatMessages(messages);
        });

        socket.on("user-list", (new_users) => {
            setUsers(new_users);
        });

        socket.on("message", msg => {
            addMessage(msg);
        });
    // eslint-disable-next-line
    }, []);

    React.useEffect(() => {
        console.log(chat_messages);
        console.log(users);
        console.log(room_name);
    }, [chat_messages, users, room_name])

    return (
        <div className="chat">
            <header className="chat-header">
                Salon - {room_name}
            </header>
            <main className="chat-main">
                <UserList users={users}/>
                <main className="messages-container">
                    <MessagesContainer messages={chat_messages}/>
                    <ChatForm sendMessage={sendMessage}/>
                </main>
            </main>
        </div>
    );
}