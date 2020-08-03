import React from "react";

import {useHistory, Link} from "react-router-dom";

import Message from "../Utils/Message.js";
import {sendForm, formatDate, getUrlQuery} from "../../utils.js";
//import {UserContext} from "../../App.js";

// CREATE
function CreateChatrooms() {
    //Vars
    const [state, setState] = React.useState({
        title: "",
        is_private: false
    });

    const [messages, setMessages] = React.useState([]);

    const history = useHistory();

    //Functions
    const handleTitlechange = function(e) {
        const value = e.target.value;

        if(value.length <= 100)
            setState({...state, title: value});
    }

    const handleCheckBoxChange = function(e) {
        const value = e.target.checked;

        setState({...state, is_private: value});
    }

    const handleSubmit = function(e) {
        e.preventDefault();
        
        const req_params = {
            method: "POST",
            url: "/api/chatrooms",
            type:"json"
        }

        sendForm(req_params, {name: state.title, is_private: state.is_private}, (err, res) => {
            if(err) {
                const new_messages = [];
                for(let message of JSON.parse(res)) {
                    new_messages.push({
                        content: message,
                        col: "red"
                    });
                }
                setMessages(new_messages);
            } else {
                history.push(`/chatroom/${res}`);
            }
        });
    }

    //Render
    return (
        <form className="login-form">
            <Message messages={messages} /> 
            <div>
                <label htmlFor="title"> Titre: <span className="char-counter">{`${state.title.length}/100`}</span></label>
            </div>
            <input className="input t1"
                type="text" name="title"
                value={state.title}
                onChange={handleTitlechange}
            ></input>
            <div>
                <label htmlFor="isprivate"> Privée:</label>
                <input className="input t1"
                    type="checkbox" name="isprivate"
                    checked={state.is_private}
                    onChange={handleCheckBoxChange}
                ></input>
            </div>
            <button className="button col1 submit" onClick={handleSubmit}>Créer</button>
        </form>
    );
}

// CHATROOM SEARCH
function ChatroomCard({room}) {
    return (
        <div className="chat-card">
            <div className="chatcard-infos">
                <h3><Link to={`/chatroom/${room.chatroom_id}`}>{room.chatroom_name}</Link></h3>
                <span>Créer le {formatDate(room.chatroom_creation_date)} Par <Link to={`/user/${room.chatroom_admin}`}>{room.user_name}</Link></span>
            </div>
        </div>
    );
}

function SearchContent({rooms}) {
    let rooms_el = [];

    for(let i = 0; i < rooms.length; i++) {
        rooms_el.push(
            <ChatroomCard key={i} room={rooms[i]}/>
        );
    }

    if(rooms_el.length === 0) {
        rooms_el = "Pas de résultat"
    }

    return (
        <React.Fragment>
            {rooms_el}
        </React.Fragment>
    );
}

function SearchBar({search}) {
    //Vars
    const [search_query, setSearchQuery] = React.useState("");

    const [search_timeout, setSearchTimeout] = React.useState(undefined);

    //Functions
    const handleSearchChange = function(e) {
        const value = e.target.value;

        setSearchQuery(value);
    }

    React.useEffect(() => {
        if(search_timeout) {
            clearTimeout(search_timeout);
        }

        setSearchTimeout(setTimeout(() => {
            search(search_query);
        }, 500));
        // eslint-disable-next-line
    }, [search_query]);

    return (
        <form action="" method="get" className="search-bar">
            <input 
                type="text" className="input t1" placeholder="Rechercher" 
                onChange={handleSearchChange} value={search_query}
            />
        </form>        
    );
}

function PageController({changePage, length, start}) {
    //Functions
    const next = function() {
        if(length === 9)
            changePage(1);
    }

    const prev = function() {
        if(start >= 8)
            changePage(-1);
    }
    
    return (
        <div className="page-controller">
            { length > 9 || start >=8 ?
                <React.Fragment>
                    <button className="button norm" onClick={next}>Page précédente</button>
                    <button className="button norm" onClick={prev}>Page suivante</button>
                </React.Fragment> : ""
            }
        </div>
    );
}

function ChatroomsPage({type}) {
    //Vars
    const [state, setState] = React.useState({
        search: "",
        start: 0
    });

    const [rooms, setRooms] = React.useState([]);
    const [messages, setMessages] = React.useState([]);

    const step = 8;

    //Functions
    const getChatrooms = function() {
        const query_params = getUrlQuery({
            search: state.search,
            start: state.start,
            step: step,
            type: type
        });

        fetch(`/api/chatrooms?${query_params}`)
            .then(res => res.json())
            .then(chatrooms => setRooms(chatrooms))
            .catch(() => {
                setMessages([{content: "Impossible de récuperer les salons", col:"red"}]);
            });
    }

    const handleSearch = function(query) {
        setState({
            start: 0,
            search: query
        });
    }

    const handlePageChange = function(value) {
        //Value is 1 or -1
        setState({
            ...state,
            start: state.start += step * value
        });
    }

    React.useEffect(getChatrooms, [state, type]);

    return (
        <div className="friend-section_container">
            <SearchBar search={handleSearch}/>
            <Message messages={messages} />
            <SearchContent rooms={rooms}/>
            <PageController changePage={handlePageChange} length={rooms.length} start={state.start}/>
        </div>
    );
}

// SECTION SELECTOR
function ChatroomsMenu({changeSection, curr_section}) {
    return (
        <div className="friend-menu">
            <span className="friend-link" id={curr_section === "public" ? "selected" : ""}
                onClick={() => {changeSection("public")}}
            >Publiques</span>
            <span className="friend-link" id={curr_section === "private" ? "selected" : ""}
                onClick={() => {changeSection("private")}}
            >Privées</span>
            <span className="friend-link" id={curr_section === "create" ? "selected" : ""}
                onClick={() => {changeSection("create")}}
            >Créer</span>
        </div>
    );
}

export default function Chatrooms() {

    const elements = {
        create: <CreateChatrooms />,
        private: <ChatroomsPage type="private"/>,
        public: <ChatroomsPage type="public"/>
    }

    const [selected_section, setSelectedSection] = React.useState("public");

    return (
        <div className="friends-list">
            <ChatroomsMenu changeSection={setSelectedSection} curr_section={selected_section}/>
            {elements[selected_section]}
        </div>
    );
}