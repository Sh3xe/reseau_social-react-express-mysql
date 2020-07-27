import React from "react";

import {validateForm, sendForm} from "../utils.js";

import {Link} from "react-router-dom";

export default function Register() {

    const start_state = {
        username: "",
        password: "",
        email: "",
        key: "",
        password_visible: false,
        messages: ""
    }

    const [state, setState] = React.useState(start_state);

    const handleSubmit = function(e) {
        e.preventDefault();
        
        const form_data = {
            name: state.username,
            password: state.password,
            email: state.email,
            key: state.key
        };

        const errors = validateForm(form_data, {
            name: {min:3, max:100},
            password: {min:8, max:100},
            email: {max:255},
            key: {min: 25, max: 25}
        });

        if(errors.length) {
            setState({
                ...state,
                messages: JSON.stringify(errors)
            });
            return;
        }

        const req_params = {
            url: "api/register",
            method: "POST",
            type: "json"
        }

        sendForm(req_params, form_data, (err, res) => {
            if(!err) {
                setState({
                    ...start_state,
                    messages: ["Vous vous êtes enregistré(e)!"]
                })
            } else {
                setState({
                    ...state,
                    messages: JSON.stringify(res)
                });
            }
        })
    }

    const handleInputChange = function(e) {
        e.preventDefault();
        const element = e.target;

        switch(element.getAttribute("name")) {
            case "username":
                setState({...state, username: element.value});
                break;
            case "password":
                setState({...state, password: element.value});
                break;
            case "email":
                setState({...state, email: element.value});
                break;
            case "key":
                setState({...state, key: element.value});
                break;
            default: break;
        }
    }

    const togglePasswordVisibility = function(e) {
        e.preventDefault();
        setState({...state, password_visible: !state.password_visible});
    }

    return (
        <div className="form-container">
            <header className="login-head">S'enregistrer ou <Link to="/login">S'identifier </Link></header>
            <div>{state.messages}</div>
            <form className="login-form">
                <div>
                    <label htmlFor="key"> Clé d'enregistrement </label>
                </div>
                    <input className="input t1"
                        type="text" name="key"
                        value={state.key} onChange={handleInputChange}
                    ></input>
                <div>
                    <label htmlFor="username"> Nom d'utilisateur </label>
                </div>
                    <input className="input t1"
                        type="text" name="username"
                        value={state.username} onChange={handleInputChange}
                    ></input>
                <div>
                    <label htmlFor="email"> E-mail </label>
                </div>
                    <input className="input t1"
                        type="email" name="email"
                        value={state.email} onChange={handleInputChange}
                    ></input>
                <div>
                    <label htmlFor="password"> Mot de passe </label>
                    <button onClick={togglePasswordVisibility} className="toggle-password">
                        {state.password_visible ? "Hide" : "Show"}
                    </button>
                </div>
                    <input className="input t1"
                        type={state.password_visible ? "text" : "password"} name="password" required
                        value={state.password} onChange={handleInputChange}
                    ></input>
                <button onClick={handleSubmit} className="button col1"> S'enregistrer</button>
            </form>
        </div>
    );
}