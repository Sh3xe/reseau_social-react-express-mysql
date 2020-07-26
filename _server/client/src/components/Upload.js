import React from "react";

import {validateForm, sendForm} from "../utils.js";

export default function Upload() {
    const start_state = {
        title: "",
        content:"",
    }

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

        let form_data = {
            title: state.title,
            content: state.content
        };

        const errors = validateForm(form_data, {
            title: {min: 1, max:255},
            content: {min:1, max:2000}
        });

        if(errors) {
            return;
        }

        console.log(file_input.current.files)

        let files = [];

        for(let file of file_input.current.files) {
            files.push(file.);
        }

/*
        form_data = {
            ...form_data,

        }
/*
        sendForm("/upload", "POST", JSON.stringify(form_data), (res, err) => {
            console.log(err, res);
        });*/
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
                    <label htmlFor="file"> Fichiers </label>
                </div>
                <input className="input t1"
                    ref={file_input}
                    type="file" name="file" required multiple
                ></input>
                <button className="button col1" onClick={handleSubmit}> Poster! </button>
            </form>
        </div>
    );
}