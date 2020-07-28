import React from "react";

import {validateForm, sendForm} from "../utils.js";

export default function Upload() {
    const start_state = {
        title: "",
        content:"",
    }

    const select_ref = React.useRef(null);
    const file_input = React.useRef(null);

    const [state, setState] = React.useState(start_state);

    const handleInputChange = function(e) {
        e.preventDefault();

        const new_state = {...state}
        new_state[e.target.getAttribute("name")] = e.target.value;

        setState(new_state);
    }

    const handleSubmit = function(e) {
        e.preventDefault();

        const errors = validateForm({
            title: state.title,
            content: state.content
        }, {
            title: {min: 1, max:255},
            content: {min:1, max:2000}
        });

        if(errors) {
            return;
        }

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
            console.log(err, res);
        });
    }

    return (
        <div className="form-container upload">
            <header className="login-head"> Poster </header>
            <form className="login-form">
                <div>
                    <label htmlFor="title"> Titre </label>
                </div>
                <input className="input t1"
                    type="text" name="title"
                    onChange={handleInputChange} value={state.title}
                ></input>
                <div>
                    <label htmlFor="content"> Contenu </label>
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