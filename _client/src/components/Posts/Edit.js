import React from "react";

import {sendForm} from "../../utils.js";
import Message from "../Utils/Message.js";

export default function Edit(props) {
    //Hooks
    const {post_id} = props.match.params;

    const [messages, setMessages] = React.useState([]);
    const [state, setState] = React.useState({
        content: "",
        title: "",
        category: ""
    });

    //Functions
    const handleTitleChange = function(e) {
        const value = e.target.value
        setState({
            ...state,
            title: value
        });
    }

    const handleContentChange = function(e) {
        const value = e.target.value
        setState({
            ...state,
            content: value
        });
    }

    const handleSelectChange = function(e) {
        const value = e.target.value;

        setState({
            ...state,
            category: value
        });
    }

    const handleSubmit = function() {
        const form_data = {
            content: state.content,
            title: state.title,
            category: state.category
        }

        const params = {
            url: `/api/post/${post_id}`,
            method: "PATCH",
            type:"json"
        }

        sendForm(params, form_data, (err) => {
            if(!err) {
                props.history.push(`/post/${post_id}`)
            } else {
                setMessages([{content:"Impossible de modifier ce post", col:"red"}]);
            }
        });
    }

    React.useEffect(() => {
        fetch(`/api/post/${post_id}`)
        .then(res => res.json())
        .then(post => {
            setState({
                content: post.post_content,
                title: post.post_title,
                category: post.post_category
            });
        }).catch(() => {
            setMessages([{content:"Aucun post trouvé", col:"red"}]);
        });
    }, [post_id])

    return (
        <div className="form-container upload edit-form">
            <Message messages={messages}/>
            <input 
                className="input t1"
                type="text" value={state.title} onChange={handleTitleChange}
            ></input>
            <textarea 
                className="input t1"
                value={state.content} onChange={handleContentChange}
            ></textarea>
            <select className="input" onChange={handleSelectChange} value={state.category}>
                <option>Tout</option>
                <option>Jeux vidéos</option>
                <option>Memes</option>
            </select>
            <button onClick={handleSubmit} className="button col1">Modifier</button>
        </div>
    );
}