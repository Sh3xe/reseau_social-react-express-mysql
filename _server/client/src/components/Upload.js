import React from "react";

import Message from "./Message.js";
import {sendForm} from "../utils.js";

export default function Upload(props) {
    const start_state = {
        title: "",
        content:"",
        messages: []
    }

    const select_ref = React.useRef(null);
    const file_input = React.useRef(null);

    const [state, setState] = React.useState(start_state);

    const handleInputChange = function(e) {
        e.preventDefault();
		const value = e.target.value;

        switch(e.target.getAttribute("name")) {
            case "title":
				if(value.length <= 57) 
					setState({...state, title: value});

                break;
            case "content" :
				if(value.length <= 2500) 
					setState({...state, content: value});

				break;
			default: break;
        }
    }

    const handleSubmit = function(e) {
        e.preventDefault();
        const form_data = new FormData();

        const selected_category = select_ref.current.options[select_ref.current.selectedIndex].text;

        form_data.append("category", selected_category);
        form_data.append("title", state.title);
        form_data.append("content", state.content);

        for(let file of file_input.current.files) {
            form_data.append("files[]", file);
        }

        const req_params = {
            method: "POST",
            url:"api/upload"
        }

        sendForm(req_params, form_data, (err, res) => {
            if(!err) {
                props.history.push(`/post/${res}`);
            } else {
                setState({
                    ...state,
                    messages: [{content: "Impossible d'ajouter l'article.", col: "red"}]
                })
            }
        });
    }

    return (
        <div className="form-container upload">
            <Message messages={state.messages}/>
            <header className="login-head"> Poster </header>
            <form className="login-form">
                <div>
                    <label htmlFor="title"> Titre <span className="char-counter">{`${state.title.length}/57`}</span></label>
                </div>
                <input className="input t1"
                    type="text" name="title"
                    onChange={handleInputChange} value={state.title}
                ></input>
                <div>
					<label htmlFor="content"> Contenu <span className="char-counter">{`${state.content.length}/2500`}</span></label>
				</div>
					<textarea className="input t1"
						name="content" required
						onChange={handleInputChange} value={state.content}
				></textarea>
				<div>
					<input
						ref={file_input}
						type="file" name="file" required multiple
					></input>
				</div>
                <button className="button col1" onClick={handleSubmit}> Poster! </button>
                <select className="select-input" ref={select_ref}>
                    <option>Tout</option>
                    <option>Jeux vidéos</option>
                    <option>Memes</option>
                </select>
            </form>
        </div>
    );
}