import React from "react";
import {Link} from "react-router-dom";

import {validateForm, sendForm} from "../utils.js";
import {UserContext} from "../App.js";
import Cookies from "js-cookie";

function Message({messages}) {
    let messages_el = [];

    for(let i = 0; i < messages.length; i++) {
        const class_name = `log-message ${messages[i].col}`;
        messages_el.push(
        <div className={class_name} key={i}>
            {messages[i].content}
        </div>);
    }

    return (
        <div>
            {messages_el}
        </div>
    );
}

export default function Login() {

    const start_state = {
        password: "",
        email: "",
        password_visible: false,
        messages: []
    };

    const {setUser} = React.useContext(UserContext);

    const [state, setState] = React.useState(start_state);

    const handleSubmit = function(e) {
        e.preventDefault();
        
        const form_data = {
            password: state.password,
            email: state.email
        }

        const errors = validateForm(form_data, {
            password: {min:8, max:100},
            email: {max:100}
        });

        if(errors.length) {
            setState({
                ...state,
                messages: errors
            });
            return null;
        }

        const req_params = {
            method: "POST",
            url:"api/login",
            type:"json"
        }

        sendForm(req_params, form_data, (err, res) => {
            if(!err) {
                const user = JSON.parse(res);
                Cookies.set("user", true);
                setUser(user);
                setState({
                    ...state,
                    messages: [{col:"green", content: `Identifié en tant que "${user.user_name}"`}]
                });
            } else {
                Cookies.set("user", false);
                setState({
                    ...state,
                    messages: [{col:"red", content: res}]
                });
            }
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
        <div className="form-container">
            <Message messages={state.messages} />
            <header className="login-head">S'identifier ou <Link to="/register">S'enregistrer </Link></header>
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