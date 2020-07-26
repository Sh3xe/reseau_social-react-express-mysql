import React from "react";

import {validateForm, sendBody} from "../utils.js";
import {UserContext} from "../App.js";
import Cookies from "js-cookie";

export default function Login() {

    const start_state = {
        password: "",
        email: "",
        password_visible: false,
        messages: ""
    };

    const {setUser} = React.useContext(UserContext);

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
            .then( res => res.json())
            .then( user => {
                setUser(user);
                setState({
                    ...state,
                    messages: JSON.stringify(user)
                });
                Cookies.set("user", true)
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
        <div className="login-container">
            { state.messages ? <div className="log-message red">
                {state.messages}
            </div> : ""} 
            <header className="login-head">S'identifier </header>
            <form className="login-form">
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
                <button onClick={handleSubmit} className="button col1"> S'identifier</button>
            </form>
        </div>
    );
}