import React from "react";

import {validateForm, sendForm} from "../utils.js";

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
        
        let form_data = {
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

        sendForm("api/register", "POST", JSON.stringify(form_data), (err, res) => {
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
        <div>
            <h1>S'enregistrer</h1>
            <div>{state.messages}</div>
            <form className="login-form">
                <div>
                    <label htmlFor="key"> Clé d'enregistrement </label>
                    <input 
                        type="text" name="key"
                        value={state.key} onChange={handleInputChange}
                    ></input>
                </div>
                <div>
                    <label htmlFor="username"> Nom d'utilisateur </label>
                    <input 
                        type="text" name="username"
                        value={state.username} onChange={handleInputChange}
                    ></input>
                </div>
                <div>
                    <label htmlFor="email"> E-mail </label>
                    <input 
                        type="email" name="email"
                        value={state.email} onChange={handleInputChange}
                    ></input>
                </div>
                <div>
                    <label htmlFor="password"> Mot de passe </label>
                    <input 
                        type={state.password_visible ? "text" : "password"} name="password" required
                        value={state.password} onChange={handleInputChange}
                    ></input>
                    <button onClick={togglePasswordVisibility}>{state.password_visible ? "Hide" : "Show"}</button>
                </div>
                <button onClick={handleSubmit}> S'enregistrer</button>
            </form>
        </div>
    );
}