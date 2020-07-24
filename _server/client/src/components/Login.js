import React from "react";

import {validateForm, sendBody} from "../utils.js";

export default function Login() {

    const start_state = {
        password: "",
        email: "",
        password_visible: false,
        messages: ""
    };

    const [state, setState] = React.useState(start_state);

    const handleSubmit = function(e) {
        e.preventDefault();
        
        const form_data = {
            password: state.password,
            email: state.email
        };

        const errors = validateForm(form_data, {
            password: {min:8, max:100},
            email: {max:100}
        });

        if(errors.length) {
            setState({
                ...state,
                messages: JSON.stringify(errors)
            });
            return null;
        }

        sendBody("api/login", form_data)
            .then((e) => {
                e.json().then(e => setState({
                    ...start_state,
                    messages: JSON.stringify(e)
                }))
            })
            .catch(e => {
                setState({
                    ...state,
                    messages: JSON.stringify(e)
                });
            });
    }

    const handleInputChange = function(e) {
        e.preventDefault();
        const element = e.target;

        switch(element.getAttribute("name")) {
            case "password":
                setState({...state, password: element.value});
                break;
            case "email":
                setState({...state, email: element.value});
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
            <h1>S'identifier</h1>
            <div>{state.messages}</div>
            <form className="login-form">
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
                <button onClick={handleSubmit}> S'identifier</button>
            </form>
        </div>
    );
}